"use client";

import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center bg-[#0f172a] text-white">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}