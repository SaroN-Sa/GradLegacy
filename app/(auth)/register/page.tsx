import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6">
          Create Account
        </h1>

        <RegisterForm />
      </div>
    </main>
  );
}