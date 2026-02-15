"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { saveToken, isAdminRead } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const passwordStrength = password.length >= 8 ? "strong" : password.length >= 4 ? "medium" : "weak";
  const getPasswordColor = () => {
    if (password.length === 0) return "bg-gray-200";
    if (passwordStrength === "strong") return "bg-green-500";
    if (passwordStrength === "medium") return "bg-yellow-500";
    return "bg-red-500";
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/api/auth/signup", { email, password, name: name || undefined });
      const res = await api.post("/api/auth/login", { email, password });
      saveToken(res.data.token);
      const goAdmin = isAdminRead();
      router.push(goAdmin ? "/admin/dashboard" : "/dashboard");
    } catch (err: any) {
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
        setError(err?.message || "Signup failed");
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
          <div className="inline-flex items-center justify-center mb-6">
            <Logo href="/" width={200} height={60} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join us and get started today</p>
        </div>

        {/* Form Card */}
        <form onSubmit={submit} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm flex items-start gap-3 animate-in fade-in">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">Full Name <span className="text-gray-500">(optional)</span></label>
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:border-[#2D89FF] focus:bg-white/10 focus:ring-2 focus:ring-[#2D89FF]/30" 
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">Email Address</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                type="email" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:border-[#2D89FF] focus:bg-white/10 focus:ring-2 focus:ring-[#2D89FF]/30" 
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">Password</label>
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
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <a href="/login" className="text-[#2D89FF] font-semibold hover:underline transition-colors">
              Sign in here
            </a>
          </div>
        </form>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}


