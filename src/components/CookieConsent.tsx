"use client";
import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/10 shadow-lg p-4">
      <div className="container max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-black/80">
          We use cookies to improve your experience. By continuing, you accept our{" "}
          <a href="/legal" className="underline" style={{ color: "#2D89FF" }}>
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm rounded-lg border border-black/20 hover:bg-black/5"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-lg font-semibold text-white hover:brightness-95"
            style={{ backgroundColor: "#2D89FF" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

