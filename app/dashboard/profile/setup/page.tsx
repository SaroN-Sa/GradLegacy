"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";

import ImageUpload from "@/components/profile/ImageUpload";

export default function ProfileSetupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const user =
        await authService.getCurrentUser();

      if (!user) {
        setMessage(
          "Please login first."
        );
        return;
      }

      const existingUsername =
        await profileService.getProfileByUsername(
          form.username
        );

      if (existingUsername) {
        setMessage(
          "Username already exists."
        );
        return;
      }

      await profileService.createProfile({
        userId: user.$id,

        fullName: form.fullName,
        username: form.username,
        bio: form.bio,

        university: form.university,
        department: form.department,

        graduationYear:
          Number(form.graduationYear),

        profileImage:
          form.profileImage,

        coverImage:
          form.coverImage,

        language: "en",
        theme: "default",
      });

      setMessage(
        "Profile created successfully!"
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error(error);

      setMessage(
        error?.message ||
          "Failed to create profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl border p-6 shadow">
        <h1 className="mb-2 text-3xl font-bold">
          Create Your Graduate Profile
        </h1>

        <p className="mb-8 text-gray-500">
          Set up your graduation page.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <textarea
            name="bio"
            placeholder="Tell people about yourself..."
            value={form.bio}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            rows={4}
          />

          <input
            name="university"
            placeholder="University"
            value={form.university}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            name="graduationYear"
            type="number"
            placeholder="Graduation Year"
            value={form.graduationYear}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <ImageUpload
            label="Profile Photo"
            onUpload={(url) =>
              setForm((prev) => ({
                ...prev,
                profileImage: url,
              }))
            }
          />

          {form.profileImage && (
            <img
              src={form.profileImage}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover"
            />
          )}

          <ImageUpload
            label="Cover Photo"
            onUpload={(url) =>
              setForm((prev) => ({
                ...prev,
                coverImage: url,
              }))
            }
          />

          {form.coverImage && (
            <img
              src={form.coverImage}
              alt="Cover"
              className="h-40 w-full rounded-lg object-cover"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Profile"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}