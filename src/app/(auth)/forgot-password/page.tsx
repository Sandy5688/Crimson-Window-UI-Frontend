"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("If an account exists for that email, a reset link has been sent.");
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
        setError(err?.message || "Request failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#F5F5F5]">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4 border border-black/5">
        <h1 className="text-xl font-semibold">Forgot your password?</h1>
        {message && <div className="text-green-700 text-sm">{message}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D89FF]" />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-[#2D89FF] text-white py-2 hover:brightness-95 disabled:opacity-70">
          {loading ? "Sending..." : "Send reset link"}
        </button>
        <div className="text-sm text-black/60">
          <a href="/login" className="text-[#2D89FF] hover:underline">Back to sign in</a>
        </div>
      </form>
    </div>
  );
}


