"use client";

import { useState } from "react";
import { authService } from "@/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await authService.forgotPassword(email);

      setSent(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send recovery email");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="p-8">
        <h1>Email Sent</h1>
        <p>
          Check your inbox for the password reset link.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Forgot Password
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full border p-3"
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}