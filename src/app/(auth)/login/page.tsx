"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      saveToken(res.data.token);
      router.push("/channels");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#F5F5F5]">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4 border border-black/5">
        <h1 className="text-xl font-semibold">Sign in</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D89FF]" />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D89FF]" />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-[#2D89FF] text-white py-2 hover:brightness-95 disabled:opacity-70">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <div className="text-sm text-black/60 flex items-center justify-between">
          <span>
            New here? <a href="/signup" className="text-[#2D89FF] hover:underline">Create an account</a>
          </span>
          <a href="/forgot-password" className="text-[#2D89FF] hover:underline">Forgot password?</a>
        </div>
      </form>
    </div>
  );
}


