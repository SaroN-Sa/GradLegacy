"use client";

import { useState } from "react";
import { authService } from "@/services/auth";

export default function RegisterForm() {
  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(
      e.currentTarget
    );

    const name = formData.get(
      "name"
    ) as string;

    const email = formData.get(
      "email"
    ) as string;

    const password = formData.get(
      "password"
    ) as string;

    try {
      await authService.register(
        name,
        email,
        password
      );

      alert("Account created!");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="name"
        placeholder="Full Name"
        className="w-full border p-3 rounded"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full border p-3 rounded"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full border p-3 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full border p-3 rounded"
      >
        {loading
          ? "Creating..."
          : "Create Account"}
      </button>
    </form>
  );
}