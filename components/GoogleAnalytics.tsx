"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-HFTEST2026";
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    try {
      // Check if user accepted cookies or consent is saved
      const consent = localStorage.getItem("homefeast-cookie-consent");
      if (consent === "all") {
        setHasConsent(true);
      }
    } catch {}
  }, []);

  if (!gaId || !hasConsent) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}
