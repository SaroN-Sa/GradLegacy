"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Settings,
} from "lucide-react";

import { useAccount } from "@/hooks/useAccount";

import EmailCard from "@/components/settings/account/EmailCard";
import PasswordCard from "@/components/settings/account/PasswordCard";
import SessionsCard from "@/components/settings/account/SessionsCard";


import ChangeEmailModal from "@/components/settings/account/ChangeEmailModal";
import ChangePasswordModal from "@/components/settings/account/ChangePasswordModal";
import LogoutAllModal from "@/components/settings/account/LogoutAllModal";


export default function AccountSettingsPage() {
  const router = useRouter();

  const {
    account,
    sessions,
    loading,

    changeEmail,
    changePassword,

    logoutAllSessions,
  } = useAccount();

  const [emailOpen, setEmailOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  // This is the actual fix: we AWAIT logoutAllSessions() (which should call
  // account.deleteSessions() inside useAccount), close the modal, and only
  // THEN redirect to /login. Previously the modal's onConfirm was wired
  // directly to logoutAllSessions with no guarantee the redirect (if any)
  // waited for the delete call to actually finish.
  async function handleConfirmLogoutAll() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError(null);

    try {
      await logoutAllSessions();
    } catch (err) {
      const isUnauthorized =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: number }).code === 401;

      // 401 here just means there was no session left to delete -
      // treat that as a successful logout rather than an error.
      if (!isUnauthorized) {
        console.error("Failed to logout all sessions:", err);
        setLogoutError(
          "Something went wrong while logging out. Please try again."
        );
        setLoggingOut(false);
        return;
      }
    }

    setLoggingOut(false);
    setLogoutOpen(false);
    router.replace("/login");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <button
            onClick={() => router.push("/dashboard/settings")}
            className="mb-3 flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Settings
          </button>

          <div className="flex items-center gap-3">

            <Settings className="h-8 w-8 text-blue-600" />

            <div>

              <h1 className="text-3xl font-bold">
                Account Settings
              </h1>

              <p className="text-gray-500">
                Manage your account security and authentication.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Loading */}

      {loading && (
        <div className="rounded-xl border p-6 text-center">
          Loading account...
        </div>
      )}

      {!loading && (
        <>

          <EmailCard
            account={account}
            onChangeEmail={() =>
              setEmailOpen(true)
            }
          />

          <PasswordCard
            onChangePassword={() =>
              setPasswordOpen(true)
            }
          />

          <SessionsCard
            sessions={sessions}
            onLogoutAll={() =>
              setLogoutOpen(true)
            }
          />

         

        </>
      )}

      {/* Modals */}

      <ChangeEmailModal
        open={emailOpen}
        currentEmail={account?.email ?? ""}
        onClose={() => setEmailOpen(false)}
        onSubmit={changeEmail}
      />

      <ChangePasswordModal
        open={passwordOpen}
        onClose={() =>
          setPasswordOpen(false)
        }
        onSubmit={changePassword}
      />

      <LogoutAllModal
        open={logoutOpen}
        onClose={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
        onConfirm={handleConfirmLogoutAll}
        loading={loggingOut}
        error={logoutError}
      />

      

    </div>
  );
}