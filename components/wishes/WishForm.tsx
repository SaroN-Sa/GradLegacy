"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import {
  User,
  Mail,
  MessageSquareHeart,
  ImagePlus,
  Video,
  X,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  Users,
  GraduationCap,
  Heart,
  Briefcase,
  UserRound,
} from "lucide-react";

import { wishService } from "@/services/wish";

import {
  CreateWishData,
  WishRelationship,
} from "@/types/wish";

interface WishFormProps {
  userId: string;
  onSuccess?: () => void;
}

const RELATIONSHIP_OPTIONS: { value: WishRelationship; label: string; icon: typeof User }[] = [
  { value: "parent", label: "Parent", icon: Heart },
  { value: "friend", label: "Friend", icon: Users },
  { value: "teacher", label: "Teacher", icon: GraduationCap },
  { value: "relative", label: "Relative", icon: UserRound },
  { value: "mentor", label: "Mentor", icon: User },
  { value: "colleague", label: "Colleague", icon: Briefcase },
];

const MESSAGE_MAX = 500;

const initialFormData: CreateWishData = {
  visitorName: "",
  visitorEmail: "",
  relationship: "friend",
  message: "",
  isAnonymous: false,
  imageUrl: "",
  videoUrl: "",
  status: "pending",
  isFeatured: false,
};

type MediaTab = "image" | "video";
type LoadingStage = "idle" | "uploading" | "saving";

/**
 * Uploads a file to the app's /api/upload route (Cloudinary-backed)
 * and returns the hosted URL to persist on the Wish document.
 */
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // response body wasn't JSON — fall through to status-based error below
  }

  if (!response.ok) {
    throw new Error(
      data?.error || `Upload failed with status ${response.status}`
    );
  }

  if (!data?.url) {
    throw new Error("Upload response missing url");
  }

  return data.url as string;
}

export default function WishForm({
  userId,
  onSuccess,
}: WishFormProps) {
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("idle");
  const loading = loadingStage !== "idle";
  const [formData, setFormData] = useState<CreateWishData>(initialFormData);

  const [mediaTab, setMediaTab] = useState<MediaTab>("image");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const validateForm = () => {
    if (!formData.visitorName.trim()) return "Visitor name is required.";
    if (!formData.relationship) return "Relationship is required.";
    if (!formData.message.trim()) return "Message is required.";
    if (
      formData.visitorEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.visitorEmail)
    ) {
      return "Invalid email address.";
    }
    return "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let imageUrl = "";
      let videoUrl = "";

      if (imageFile || videoFile) {
        setLoadingStage("uploading");

        if (imageFile) {
          imageUrl = await uploadFile(imageFile);
        }
        if (videoFile) {
          videoUrl = await uploadFile(videoFile);
        }
      }

      setLoadingStage("saving");

      await wishService.createWish(userId, {
        ...formData,
        imageUrl,
        videoUrl,
      });

      setSuccess("Your graduation wish has been submitted successfully.");
      setFormData(initialFormData);
      setMediaTab("image");
      removeImage();
      removeVideo();

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your wish. Please try again."
      );
    } finally {
      setLoadingStage("idle");
    }
  };

  const messageLength = formData.message.length;
  const isMessageNearLimit = messageLength > MESSAGE_MAX * 0.85;

  const submitLabel =
    loadingStage === "uploading"
      ? "Uploading..."
      : loadingStage === "saving"
      ? "Saving..."
      : "Submit Wish";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 shadow-lg shadow-black/20"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD700]/10 text-[#FFD700]">
          <MessageSquareHeart size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Leave a Graduation Wish</h2>
          <p className="text-xs text-slate-400">Share a message of congratulations.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-900/20 border border-red-500/30 p-3 text-sm text-red-300 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-900/20 border border-emerald-500/30 p-3 text-sm text-emerald-300 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Your Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleTextChange}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 outline-none focus:border-[#FFD700]/60 focus:ring-4 focus:ring-[#FFD700]/10 transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Email <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="email"
              name="visitorEmail"
              value={formData.visitorEmail}
              onChange={handleTextChange}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 outline-none focus:border-[#FFD700]/60 focus:ring-4 focus:ring-[#FFD700]/10 transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      {/* Relationship — pill selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Relationship
        </label>
        <div className="flex flex-wrap gap-2">
          {RELATIONSHIP_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = formData.relationship === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, relationship: option.value }))
                }
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-slate-800 to-slate-900 border-[#FFD700] text-[#FFD700] scale-105"
                    : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                <Icon size={13} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">
            Your Wish
          </label>
          <span
            className={`text-xs ${
              isMessageNearLimit ? "text-amber-400" : "text-slate-500"
            }`}
          >
            {messageLength}/{MESSAGE_MAX}
          </span>
        </div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleTextChange}
          maxLength={MESSAGE_MAX}
          rows={5}
          className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 outline-none focus:border-[#FFD700]/60 focus:ring-4 focus:ring-[#FFD700]/10 transition-all resize-none"
          placeholder="Write your graduation wish..."
        />
      </div>

      {/* Media — combined image/video, single compact section */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">
            Add Media <span className="text-slate-500 font-normal">(optional)</span>
          </label>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 rounded-full bg-slate-900 border border-slate-700 p-0.5">
            <button
              type="button"
              onClick={() => setMediaTab("image")}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                mediaTab === "image"
                  ? "bg-[#FFD700]/10 text-[#FFD700]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <ImagePlus size={12} />
              Photo
              {imagePreview && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMediaTab("video")}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                mediaTab === "video"
                  ? "bg-[#FFD700]/10 text-[#FFD700]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Video size={12} />
              Video
              {videoPreview && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />
              )}
            </button>
          </div>
        </div>

        {mediaTab === "image" ? (
          imagePreview ? (
            <div className="relative flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/40 p-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-200">
                  {imageFile?.name}
                </p>
                <p className="text-[11px] text-slate-500">Image attached</p>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/40 py-4 text-center cursor-pointer hover:border-[#FFD700]/50 hover:bg-slate-900/70 transition-all">
              <ImagePlus className="h-4 w-4 text-[#FFD700]" />
              <span className="text-xs text-slate-400">Click to upload an image</span>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )
        ) : videoPreview ? (
          <div className="relative flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/40 p-2">
            <video
              src={videoPreview}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
              muted
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-200">
                {videoFile?.name}
              </p>
              <p className="text-[11px] text-slate-500">Video attached</p>
            </div>
            <button
              type="button"
              onClick={removeVideo}
              className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/40 py-4 text-center cursor-pointer hover:border-[#FFD700]/50 hover:bg-slate-900/70 transition-all">
            <Video className="h-4 w-4 text-[#FFD700]" />
            <span className="text-xs text-slate-400">Click to upload a video</span>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Anonymous toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3">
  <div>
    <p className="text-sm font-medium text-white">Send Anonymously</p>
    <p className="text-xs text-slate-500">Your name won't be shown publicly.</p>
  </div>
  <button
    type="button"
    role="switch"
    aria-checked={formData.isAnonymous}
    onClick={() =>
      setFormData((prev) => ({ ...prev, isAnonymous: !prev.isAnonymous }))
    }
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
      formData.isAnonymous
        ? "border-[#FFD700]/60 bg-[#FFD700]/20 shadow-[inset_0_0_8px_rgba(255,215,0,0.25)]"
        : "border-slate-700 bg-slate-800"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full shadow-md ring-1 transition-all duration-300 ease-in-out ${
        formData.isAnonymous
          ? "translate-x-6 bg-[#FFD700] ring-[#FFD700]/40 shadow-[0_0_6px_rgba(255,215,0,0.6)]"
          : "translate-x-1 bg-slate-400 ring-slate-500/40"
      }`}
    />
  </button>
</div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-[#FFD700]/50 px-4 py-3 font-semibold text-[#FFD700] transition-all hover:border-[#FFD700] hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {submitLabel}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {submitLabel}
          </>
        )}
      </button>
    </form>
  );
}