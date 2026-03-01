"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type ServiceStatus = {
    name: string;
    status: "online" | "degraded" | "offline";
    latency?: number;
    description: string;
};

const STATIC_SERVICES: ServiceStatus[] = [
    { name: "Authentication", status: "online", description: "Login, signup, password reset" },
    { name: "File Uploads", status: "online", description: "Media upload and processing" },
    { name: "Channel Management", status: "online", description: "Platform connections and OAuth" },
    { name: "Billing", status: "online", description: "Subscription and plan management" },
    { name: "Email", status: "online", description: "Verification and notification emails" },
];

const statusColor = {
    online: "bg-green-500",
    degraded: "bg-yellow-500",
    offline: "bg-red-500",
};
const statusLabel = {
    online: "Operational",
    degraded: "Degraded",
    offline: "Offline",
};

export default function StatusPage() {
    const [services, setServices] = useState<ServiceStatus[]>(STATIC_SERVICES);
    const [automationStatus, setAutomationStatus] = useState<"online" | "degraded" | "offline" | "checking">("checking");
    const [lastChecked, setLastChecked] = useState<string>("");

    useEffect(() => {
        setLastChecked(new Date().toLocaleTimeString());
        // Ping the gateway to check backend health
        api.get("/api/health").then(() => {
            setServices(STATIC_SERVICES.map(s => ({ ...s, status: "online" })));
        }).catch(() => {
            setServices(prev => prev.map((s, i) =>
                i === 0 ? { ...s, status: "degraded" } : s
            ));
        });

        // Ping automation service
        api.get("/api/v1/automation/health").then(() => {
            setAutomationStatus("online");
        }).catch(() => {
            setAutomationStatus("offline");
        });
    }, []);

    const allOperational = services.every(s => s.status === "online") && automationStatus === "online";

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    System Status
                </h1>
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">
                    Current status of Flowpload services.
                    {lastChecked && <span className="ml-2">Last checked: {lastChecked}</span>}
                </p>
            </div>

            {/* Overall banner */}
            <div className={`rounded-2xl px-6 py-4 flex items-center gap-4 ${allOperational
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700"
                }`}>
                <div className={`w-4 h-4 rounded-full flex-shrink-0 ${allOperational ? "bg-green-500" : "bg-yellow-500"}`} />
                <div>
                    <p className={`font-semibold ${allOperational ? "text-green-800 dark:text-green-200" : "text-yellow-800 dark:text-yellow-200"}`}>
                        {allOperational ? "All Systems Operational" : "Some Services Degraded"}
                    </p>
                    <p className={`text-sm ${allOperational ? "text-green-700/70 dark:text-green-300/70" : "text-yellow-700/70 dark:text-yellow-300/70"}`}>
                        {allOperational
                            ? "All Flowpload services are running normally."
                            : "We're aware of an issue and working to resolve it."}
                    </p>
                </div>
            </div>

            {/* Core services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/10 shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-black/5 dark:border-white/10">
                    <h2 className="font-semibold dark:text-white">Core Services</h2>
                </div>
                <div className="divide-y divide-black/5 dark:divide-white/10">
                    {services.map((svc) => (
                        <div key={svc.name} className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="font-medium dark:text-white text-sm">{svc.name}</p>
                                <p className="text-xs text-black/50 dark:text-white/50">{svc.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${statusColor[svc.status]}`} />
                                <span className={`text-xs font-medium ${svc.status === "online" ? "text-green-600 dark:text-green-400" :
                                        svc.status === "degraded" ? "text-yellow-600 dark:text-yellow-400" :
                                            "text-red-600 dark:text-red-400"
                                    }`}>
                                    {statusLabel[svc.status]}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Automation service — live check */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <p className="font-medium dark:text-white text-sm">Automation Engine</p>
                            <p className="text-xs text-black/50 dark:text-white/50">Social media posting bots and scheduler</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {automationStatus === "checking" ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse" />
                            ) : (
                                <div className={`w-2.5 h-2.5 rounded-full ${statusColor[automationStatus]}`} />
                            )}
                            <span className={`text-xs font-medium ${automationStatus === "checking" ? "text-gray-500 dark:text-gray-400" :
                                    automationStatus === "online" ? "text-green-600 dark:text-green-400" :
                                        automationStatus === "degraded" ? "text-yellow-600 dark:text-yellow-400" :
                                            "text-red-600 dark:text-red-400"
                                }`}>
                                {automationStatus === "checking" ? "Checking…" : statusLabel[automationStatus]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl px-6 py-4 text-sm text-blue-800 dark:text-blue-200">
                <strong>Having issues?</strong> Contact us at{" "}
                <a href="mailto:support@flowpload.com" className="underline hover:no-underline">
                    support@flowpload.com
                </a>{" "}
                and we'll respond within 24 hours.
            </div>
        </div>
    );
}
