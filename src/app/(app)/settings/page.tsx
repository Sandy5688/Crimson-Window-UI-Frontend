"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getUserName, getEmail } from "@/lib/auth";

export default function SettingsPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        setName(getUserName() || "");
        setEmail(getEmail() || "");
    }, []);

    function showMsg(type: "success" | "error", text: string) {
        setMsg({ type, text });
        setTimeout(() => setMsg(null), 4000);
    }

    async function handleProfileSave(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return showMsg("error", "Name cannot be empty.");
        setSaving(true);
        try {
            await api.patch("/api/v1/user/profile", { name: name.trim() });
            localStorage.setItem("gateway_user_name", name.trim());
            showMsg("success", "Profile updated successfully!");
        } catch (err: any) {
            showMsg("error", err?.response?.data?.error || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    }

    async function handlePasswordChange(e: React.FormEvent) {
        e.preventDefault();
        if (!currentPassword) return showMsg("error", "Please enter your current password.");
        if (newPassword.length < 8) return showMsg("error", "New password must be at least 8 characters.");
        if (newPassword !== confirmPassword) return showMsg("error", "Passwords do not match.");
        setSaving(true);
        try {
            await api.post("/api/v1/user/change-password", { currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            showMsg("success", "Password changed successfully!");
        } catch (err: any) {
            showMsg("error", err?.response?.data?.error || "Failed to change password. Check your current password.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Settings
                </h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">Manage your account profile and security.</p>
            </div>

            {/* Status message */}
            {msg && (
                <div className={`rounded-lg px-4 py-3 text-sm border ${msg.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                        : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700"
                    }`}>
                    {msg.type === "success" ? "✅" : "❌"} {msg.text}
                </div>
            )}

            {/* Profile section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 shadow-md p-6">
                <h2 className="text-lg font-semibold dark:text-white mb-4">Profile</h2>
                <form onSubmit={handleProfileSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white/80">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-700 text-[#111827] dark:text-white px-3 py-2 focus:ring-2 focus:ring-[#2D89FF]/40 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white/80">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-gray-700/50 text-[#111827]/60 dark:text-white/40 px-3 py-2 cursor-not-allowed"
                        />
                        <p className="text-xs text-black/40 dark:text-white/40 mt-1">Email cannot be changed. Contact support if needed.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg px-5 py-2 text-sm font-bold text-white hover:brightness-95 disabled:opacity-50 transition"
                        style={{ backgroundColor: "#2D89FF" }}
                    >
                        {saving ? "Saving…" : "Save Profile"}
                    </button>
                </form>
            </div>

            {/* Password section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 shadow-md p-6">
                <h2 className="text-lg font-semibold dark:text-white mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white/80">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-700 text-[#111827] dark:text-white px-3 py-2 focus:ring-2 focus:ring-[#2D89FF]/40 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white/80">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-700 text-[#111827] dark:text-white px-3 py-2 focus:ring-2 focus:ring-[#2D89FF]/40 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white/80">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-700 text-[#111827] dark:text-white px-3 py-2 focus:ring-2 focus:ring-[#2D89FF]/40 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg px-5 py-2 text-sm font-bold text-white hover:brightness-95 disabled:opacity-50 transition"
                        style={{ backgroundColor: "#6C63FF" }}
                    >
                        {saving ? "Updating…" : "Change Password"}
                    </button>
                </form>
            </div>

            {/* Danger zone */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800/40 shadow-md p-6">
                <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
                <p className="text-sm text-black/60 dark:text-white/60 mb-4">
                    Deleting your account is permanent and cannot be undone. All your data, channels, and uploads will be lost.
                </p>
                <button
                    className="rounded-lg px-5 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition"
                    onClick={() => {
                        if (confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
                            alert("Please contact support@flowpload.com to complete account deletion.");
                        }
                    }}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}
