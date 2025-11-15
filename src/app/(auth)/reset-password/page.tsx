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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const passwordStrength = password.length >= 8 ? "strong" : password.length >= 4 ? "medium" : "weak";
  const getPasswordColor = () => {
    if (password.length === 0) return "bg-gray-200";
    if (passwordStrength === "strong") return "bg-green-500";
    if (passwordStrength === "medium") return "bg-yellow-500";
    return "bg-red-500";
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1419] via-[#1a1f2e] to-[#2D3748] p-4">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#2D89FF]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2D89FF]/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2D89FF]/20 rounded-lg mb-4">
            <svg className="w-7 h-7 text-[#2D89FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400">Create a new password to secure your account</p>
        </div>

        {/* Form Card */}
        <form onSubmit={submit} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20">
          {/* Success Message */}
          {message && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-200 text-sm flex items-start gap-3 animate-in fade-in">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm flex items-start gap-3 animate-in fade-in">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* New Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">New Password</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                type="password" 
                required 
                minLength={8}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:border-[#2D89FF] focus:bg-white/10 focus:ring-2 focus:ring-[#2D89FF]/30" 
                placeholder="••••••••"
              />
            </div>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded-full ${getPasswordColor()} transition-colors`}></div>
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength !== 'weak' ? getPasswordColor() : 'bg-gray-700'} transition-colors`}></div>
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? getPasswordColor() : 'bg-gray-700'} transition-colors`}></div>
                </div>
                <p className="text-xs text-gray-400">
                  {passwordStrength === 'strong' && <span className="text-green-400">Strong password</span>}
                  {passwordStrength === 'medium' && <span className="text-yellow-400">Moderate password</span>}
                  {passwordStrength === 'weak' && <span className="text-red-400">Weak password - minimum 8 characters</span>}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">Confirm Password</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <input 
                value={confirm} 
                onChange={(e) => setConfirm(e.target.value)}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:border-[#2D89FF] focus:bg-white/10 focus:ring-2 focus:ring-[#2D89FF]/30" 
                placeholder="••••••••"
              />
            </div>
            {confirm && password && password !== confirm && (
              <p className="text-xs text-red-400">Passwords do not match</p>
            )}
            {confirm && password && password === confirm && (
              <p className="text-xs text-green-400">Passwords match</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading} 
            className="w-full py-3 px-4 bg-gradient-to-r from-[#2D89FF] to-[#1e5fd6] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#2D89FF]/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Updating password...
              </span>
            ) : (
              "Update Password"
            )}
          </button>

          {/* Back to Sign In Link */}
          <div className="text-center text-sm">
            <span className="text-gray-400">Remember your password? </span>
            <a href="/login" className="text-[#2D89FF] font-semibold hover:underline transition-colors">
              Sign in here
            </a>
          </div>
        </form>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Your password will be securely updated
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1419] via-[#1a1f2e] to-[#2D3748]">
        <div className="text-gray-400 flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Loading...
        </div>
      </div>
    }>
      <ResetPasswordFormInner />
    </Suspense>
  );
}


