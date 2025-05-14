"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  useEffect(() => {
    if (username) {
      router.replace(`/verify/${username}`);
    } else {
      router.replace("/sign-in");
    }
  }, [router, username]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Redirecting...</h1>
        <p>Please wait while we redirect you to the verification page.</p>
      </div>
    </div>
  );
}
