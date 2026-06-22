// app/(auth)/register/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// NO wrapper div, NO container, NO padding, NO max-width here.
// RegisterForm itself is full-screen — let it breathe.
// ─────────────────────────────────────────────────────────────────────────────
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return <RegisterForm />;
}