"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken, getEmail, isEmailVerified, clearToken, saveToken } from "@/lib/auth";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Check for error from URL (from backend redirect)
    const urlError = searchParams.get('error');
    if (urlError) {
      setError(urlError);
    }
    
    // If no token, redirect to login
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    
    // If already verified, redirect to dashboard
    if (isEmailVerified()) {
      router.replace("/dashboard");
      return;
    }
    
    // Get email from token
    setEmail(getEmail());
  }, [router, searchParams]);

  async function handleResendEmail() {
    setResending(true);
    setError(null);
    setResent(false);
    
    try {
      await api.post("/auth/resend-verification");
      setResent(true);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  }

  async function handleCheckVerification() {
    setChecking(true);
    setError(null);
    
    try {
      // Refresh token to get updated email_verified status
      const { data } = await api.post("/auth/refresh-token");
      if (data.token) {
        saveToken(data.token);
        // Check if now verified
        if (isEmailVerified()) {
          router.replace("/dashboard");
        } else {
          setError("Email not yet verified. Please check your inbox and click the verification link.");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to check verification status");
    } finally {
      setChecking(false);
    }
  }

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
          <MailOutlineIcon className="text-white text-4xl" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verify Your Email
        </h1>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We&apos;ve sent a verification link to{" "}
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            {email || "your email"}
          </span>
          . Please check your inbox and click the link to verify your account.
        </p>

        {/* Status Messages */}
        {resent && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircleIcon className="text-lg" />
            <span>Verification email sent successfully!</span>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {/* Check Verification Status */}
          <button
            onClick={handleCheckVerification}
            disabled={checking}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {checking ? (
              <>
                <RefreshIcon className="animate-spin" />
                Checking...
              </>
            ) : (
              "I've Verified My Email"
            )}
          </button>

          {/* Resend Email */}
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors"
          >
            Sign out and use a different account
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <Link href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
