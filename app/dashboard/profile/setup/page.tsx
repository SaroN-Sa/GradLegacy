"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";

import ImageUpload from "@/components/profile/ImageUpload";

export default function ProfileSetupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    bio: "",
    university: "",
    department: "",
    graduationYear: "",
    profileImage: "",
    coverImage: "",
  });

  useEffect(() => {
    loadExisting();
  }, []);

  const loadExisting = async () => {
    const user = await authService.getCurrentUser();

    if (!user) return;

    const profile = await profileService.getProfileByUserId(user.$id);

    if (profile) {
      setExistingProfileId(profile.$id);

      setForm({
        fullName: profile.fullName || "",
        username: profile.username || "",
        bio: profile.bio || "",
        university: profile.university || "",
        department: profile.department || "",
        graduationYear: profile.graduationYear || "",
        profileImage: profile.profileImage || "",
        coverImage: profile.coverImage || "",
      });
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const user = await authService.getCurrentUser();

      if (!user) return;

      // 🔥 UPDATE or CREATE
      if (existingProfileId) {
        await profileService.updateProfile(existingProfileId, {
          ...form,
          graduationYear: Number(form.graduationYear),
        });
      } else {
        await profileService.createProfile({
          userId: user.$id,
          ...form,
          graduationYear: Number(form.graduationYear),
          status: "draft",
        });
      }

      setMessage("Saved successfully!");

      // 🔥 REDIRECT BACK TO DASHBOARD
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-2xl font-bold mb-4">
          Profile Setup
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="border p-2 w-full" />
          <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="border p-2 w-full" />
          <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" className="border p-2 w-full" />

          <input name="university" value={form.university} onChange={handleChange} placeholder="University" className="border p-2 w-full" />
          <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="border p-2 w-full" />

          <input name="graduationYear" value={form.graduationYear} onChange={handleChange} placeholder="Year" className="border p-2 w-full" />

          <ImageUpload
            label="Profile Image"
            onUpload={(url) =>
              setForm((p) => ({ ...p, profileImage: url }))
            }
          />

          <ImageUpload
            label="Cover Image"
            onUpload={(url) =>
              setForm((p) => ({ ...p, coverImage: url }))
            }
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

        </form>

        {message && <p className="mt-3">{message}</p>}

      </div>

    </div>
  );
}