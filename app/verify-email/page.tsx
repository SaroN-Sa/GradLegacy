"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { authService } from "@/services/auth";

export default function VerifyEmailPage() {
const searchParams = useSearchParams();

const [loading, setLoading] = useState(true);
const [verified, setVerified] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
const verify = async () => {
const userId = searchParams.get("userId");
const secret = searchParams.get("secret");

```
  if (!userId || !secret) {
    setError("Invalid verification link.");
    setLoading(false);
    return;
  }

  try {
    await authService.verifyEmail(
      userId,
      secret
    );

    setVerified(true);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Verification failed."
    );
  } finally {
    setLoading(false);
  }
};

verify();
```

}, [searchParams]);

if (loading) {
return ( <div className="min-h-screen flex items-center justify-center"> <div className="text-center"> <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" /> <p className="mt-4 text-gray-600">
Verifying your email... </p> </div> </div>
);
}

if (verified) {
return ( <div className="min-h-screen flex items-center justify-center px-6"> <div className="max-w-md w-full text-center"> <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />

```
      <h1 className="mt-6 text-3xl font-bold">
        Email Verified
      </h1>

      <p className="mt-3 text-gray-600">
        Your account has been verified successfully.
      </p>

      <Link
        href="/login"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#0f172a] px-6 py-3 text-white font-semibold"
      >
        Continue to Login
      </Link>
    </div>
  </div>
);
```

}

return ( <div className="min-h-screen flex items-center justify-center px-6"> <div className="max-w-md w-full text-center"> <XCircle className="h-20 w-20 text-red-500 mx-auto" />

```
    <h1 className="mt-6 text-3xl font-bold">
      Verification Failed
    </h1>

    <p className="mt-3 text-gray-600">
      {error}
    </p>

    <Link
      href="/register"
      className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#0f172a] px-6 py-3 text-white font-semibold"
    >
      Back to Register
    </Link>
  </div>
</div>
```

);
}
