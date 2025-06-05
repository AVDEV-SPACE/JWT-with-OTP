"use client";

import { useEffect, useState } from "react";

export default function ClientOnlyContent({ children }: { children: React.ReactNode }) {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const detectDevTools = () => {
      const width = window.innerWidth;
      const isMobile = width <= 500;

      // Detectează DevTools inclusiv în modul Responsive
      const devToolsOpen = (() => {
        const threshold = 160;
        return (
          window.outerWidth - window.innerWidth > threshold || 
          window.outerHeight - window.innerHeight > threshold || 
          window.navigator.userAgent.includes("Chrome-Lighthouse") // Uneori ajută la detecție
        );
      })();

      // **Afișează mesajul doar dacă DevTools e deschis și ecranul > 500px**
      setShowWarning(devToolsOpen && !isMobile);
    };

    detectDevTools();
    window.addEventListener("resize", detectDevTools);
    window.addEventListener("keydown", detectDevTools);

    return () => {
      window.removeEventListener("resize", detectDevTools);
      window.removeEventListener("keydown", detectDevTools);
    };
  }, []);

  // **Dacă DevTools e deschis și ecranul > 500px, afișează mesajul**
  return showWarning ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-2xl font-bold z-50">
      Turn your device or close the right section
    </div>
  ) : (
    <>{children}</>
  );
}
