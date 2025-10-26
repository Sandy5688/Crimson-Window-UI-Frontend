"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

function ResetPasswordFormInner() {
  const router = useRouter();
  const search = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = search.get("token");
    setToken(t);
  }, [search]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!token) {
      setError("Missing or invalid token");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setMessage("Password updated. Redirecting to sign in...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      // Handle different error response formats
      const errorData = err?.response?.data?.error;
      if (typeof errorData === 'string') {
        setError(errorData);
      } else if (typeof errorData === 'object') {
        const formErrors = errorData?.formErrors || [];
        const fieldErrors = errorData?.fieldErrors || {};
        
        if (formErrors.length > 0) {
          setError(formErrors.join(', '));
        } else if (Object.keys(fieldErrors).length > 0) {
          const firstField = Object.keys(fieldErrors)[0];
          const firstError = fieldErrors[firstField]?.[0] || fieldErrors[firstField];
          setError(`${firstField}: ${firstError}`);
        } else {
          setError(JSON.stringify(errorData));
        }
      } else {
        setError(err?.message || "Reset failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#F5F5F5]">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4 border border-black/5">
        <h1 className="text-xl font-semibold">Set a new password</h1>
        {message && <div className="text-green-700 text-sm">{message}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="space-y-1">
          <label className="block text-sm">New password</label>
          <input 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            required 
            minLength={8}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D89FF]" 
          />
          <p className="text-xs text-black/60">Minimum 8 characters required</p>
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Confirm password</label>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" required className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D89FF]" />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-[#2D89FF] text-white py-2 hover:brightness-95 disabled:opacity-70">
          {loading ? "Updating..." : "Update password"}
        </button>
        <div className="text-sm text-black/60">
          <a href="/login" className="text-[#2D89FF] hover:underline">Back to sign in</a>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-[#F5F5F5]"><div className="text-sm text-black/60">Loading...</div></div>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}


