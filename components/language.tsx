/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useSidebar } from "@/components/ui/sidebar"; // Using your existing hook

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function LanguageTranslationComponent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { state } = useSidebar(); // Get sidebar state from your context
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if ((window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
        setIsLoaded(true);
      }
    };
  }, []);

  // Re-initialize Google Translate when sidebar expands
  useEffect(() => {
    if (!isCollapsed && isLoaded && (window as any).google?.translate?.TranslateElement) {
      setTimeout(() => {
        window.googleTranslateElementInit?.();
      }, 100);
    }
  }, [isCollapsed, isLoaded]);

  return (
    <>
      {/* Google Translate Script */}
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.googleTranslateElementInit) {
            window.googleTranslateElementInit();
          }
        }}
      />

      {/* Responsive Google Translate Element */}
      <div className={`transition-all duration-200 ${isCollapsed ? "px-0" : "px-2"}`}>
        {isCollapsed ? (
          <div className="flex justify-center items-center p-2" title="Language Translation">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
          </div>
        ) : (
          <div id="google_translate_element" className="mb-4 overflow-hidden">
            {!isLoaded && <span>Language Translation</span>}
          </div>
        )}
      </div>
    </>
  );
}
