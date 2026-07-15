"use client";

import { useState, ChangeEvent, FormEvent } from "react";

import { wishService } from "@/services/wish";

import {
  CreateWishData,
  WishRelationship,
} from "@/types/wish";

interface WishFormProps {
  userId: string;
  onSuccess?: () => void;
}

const relationships: WishRelationship[] = [
  "parent",
  "friend",
  "teacher",
  "relative",
  "mentor",
  "colleague",
];

export default function WishForm({
  userId,
  onSuccess,
}: WishFormProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] =
    useState<CreateWishData>({
      visitorName: "",
      visitorEmail: "",
      relationship: "friend",
      message: "",
      isAnonymous: false,
      imageUrl: "",
      videoUrl: "",
      status: "pending",
      isFeatured: false,
    });

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [videoFile, setVideoFile] =
    useState<File | null>(null);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (
        e.target as HTMLInputElement
      ).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) return;

    setImageFile(e.target.files[0]);
  };

  const handleVideoChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) return;

    setVideoFile(e.target.files[0]);
  };

  const validateForm = () => {
    if (!formData.visitorName.trim()) {
      return "Visitor name is required.";
    }

    if (!formData.relationship) {
      return "Relationship is required.";
    }

    if (!formData.message.trim()) {
      return "Message is required.";
    }

    if (
      formData.visitorEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.visitorEmail
      )
    ) {
      return "Invalid email address.";
    }

    return "";
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      let videoUrl = "";

      // ---------------------------------
      // Upload Image
      // ---------------------------------
      if (imageFile) {
        // Replace with your upload service
        // Example:
        // imageUrl = await uploadImage(imageFile);
      }

      // ---------------------------------
      // Upload Video
      // ---------------------------------
      if (videoFile) {
        // Replace with your upload service
        // Example:
        // videoUrl = await uploadVideo(videoFile);
      }

      await wishService.createWish(userId, {
        ...formData,
        imageUrl,
        videoUrl,
      });

      setSuccess(
        "Your graduation wish has been submitted successfully."
      );

      setFormData({
        visitorName: "",
        visitorEmail: "",
        relationship: "friend",
        message: "",
        isAnonymous: false,
        imageUrl: "",
        videoUrl: "",
        status: "pending",
        isFeatured: false,
      });

      setImageFile(null);
      setVideoFile(null);

      onSuccess?.();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to submit your wish. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold">
        Leave a Graduation Wish
      </h2>

      {error && (
        <div className="rounded-md bg-red-100 p-3 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-100 p-3 text-green-700">
          {success}
        </div>
      )}
            <div>
        <label className="mb-2 block font-medium">
          Your Name
        </label>

        <input
          type="text"
          name="visitorName"
          value={formData.visitorName}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Email (Optional)
        </label>

        <input
          type="email"
          name="visitorEmail"
          value={formData.visitorEmail}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Relationship
        </label>

        <select
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        >
          {relationships.map((relationship) => (
            <option
              key={relationship}
              value={relationship}
            >
              {relationship}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Your Wish
        </label>

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="w-full rounded-lg border p-3"
          placeholder="Write your graduation wish..."
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Upload Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Upload Video
        </label>

        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isAnonymous"
          checked={formData.isAnonymous}
          onChange={handleChange}
        />

        Send Anonymously
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading
          ? "Submitting..."
          : "Submit Wish"}
      </button>
    </form>
  );
}