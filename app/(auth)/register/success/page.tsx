"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Mail,
  Shield,
} from "lucide-react";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#162035] flex items-center justify-center px-6 py-10 overflow-hidden relative">

      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="
          relative z-10
          w-full
          max-w-2xl
          rounded-3xl
          bg-white
          shadow-2xl
          p-8
          md:p-12
          text-center
        "
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 180,
          }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 rounded-3xl bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.35,
            type: "spring",
            stiffness: 200,
          }}
          className="flex justify-center mb-6"
        >
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="
            text-4xl
            md:text-5xl
            font-extrabold
            text-[#0f172a]
            tracking-tight
          "
        >
          Welcome to{" "}
          <span className="text-yellow-500">
            GradLegacy
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="
            mt-5
            text-gray-600
            text-lg
            leading-relaxed
            max-w-xl
            mx-auto
          "
        >
          Your account has been created successfully.
          Your graduation story is now ready to become
          a lasting digital legacy filled with memories,
          wishes, photos, and milestones.
        </motion.p>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="
            mt-10
            grid
            md:grid-cols-3
            gap-4
          "
        >
          <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50">
            <Sparkles className="mx-auto h-6 w-6 text-yellow-500 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Collect Wishes
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50">
            <Mail className="mx-auto h-6 w-6 text-blue-500 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Receive Messages
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50">
            <Shield className="mx-auto h-6 w-6 text-green-500 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Secure Forever
            </p>
          </div>
        </motion.div>

        {/* Email Verification Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="
            mt-8
            rounded-2xl
            border
            border-yellow-200
            bg-yellow-50
            p-5
          "
        >
          <p className="text-sm text-yellow-800 font-medium">
            📩 Please verify your email address before
            accessing all GradLegacy features.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="
            mt-10
            flex
            flex-col
            sm:flex-row
            gap-4
            justify-center
          "
        >
          <Link
            href="/login"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-[#0f172a]
              to-[#1e3a5f]
              px-8
              py-4
              text-white
              font-semibold
              transition-all
              hover:shadow-xl
              hover:scale-[1.02]
            "
          >
            Continue to Login
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              px-8
              py-4
              font-semibold
              text-gray-700
              transition-all
              hover:bg-gray-50
            "
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © 2026 GradLegacy — Preserving Graduation
            Memories Forever.
          </p>
        </div>
      </motion.div>
    </div>
  );
}