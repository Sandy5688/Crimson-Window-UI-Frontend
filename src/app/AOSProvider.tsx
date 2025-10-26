"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

type AOSProviderProps = {
  children: React.ReactNode;
};

export default function AOSProvider({ children }: AOSProviderProps) {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: false,
      offset: 80,
      mirror: false,
    });
  }, []);

  return children as React.ReactElement;
}


