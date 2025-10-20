"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { saveToken, getRole } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/signup", { email, password, name: name || undefined });
      const res = await api.post("/auth/login", { email, password });
      saveToken(res.data.token);
      const role = getRole();
      router.push(role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#F5F5F5]">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4 border border-black/5">
        <h1 className="text-xl font-semibold">Create your account</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="space-y-1">
          <label className="block text-sm">Name (optional)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D89FF]" />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D89FF]" />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D89FF]" />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-[#2D89FF] text-white py-2 hover:brightness-95 disabled:opacity-70">
          {loading ? "Creating..." : "Create account"}
        </button>
        <div className="text-sm text-black/60">
          Already have an account? <a href="/login" className="text-[#2D89FF] hover:underline">Sign in</a>
        </div>
      </form>
    </div>
  );
}


