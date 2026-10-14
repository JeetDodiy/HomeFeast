import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/Toaster";

export const viewport: Viewport = {
  themeColor: "#E8650A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "HomeFeast – Homemade Tiffin & Food Service Platform",
  description:
    "Connect with verified home cooks offering fresh, hygienic, home-style meals on daily, weekly, or monthly subscriptions. Serving Rajkot, Ahmedabad and more cities in Gujarat.",
  keywords:
    "homemade food, tiffin service, home cook, meal subscription, daily tiffin, Rajkot tiffin, Ahmedabad tiffin, Kathiyawadi thali, hygienic food",
  manifest: "/manifest.json",
  metadataBase: new URL("https://homefeast.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HomeFeast – Homemade Tiffin & Food Service Platform",
    description: "Fresh, hygienic, home-cooked daily, weekly & monthly tiffin meals from verified local home cooks in Rajkot & Ahmedabad.",
    url: "https://homefeast.in",
    siteName: "HomeFeast",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "HomeFeast – Fresh Homemade Tiffin Subscriptions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HomeFeast – Homemade Tiffin & Food Service",
    description: "Fresh homemade meals delivered to your door. Subscribe to verified home cooks today.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('homefeast-theme');
                  var theme = saved === 'dark' ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (localStorage.getItem('homefeast-senior-mode') === 'true') {
                    document.documentElement.classList.add('senior-mode');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <MobileBottomNav />
          <WhatsAppButton />
          <CookieConsent />
          <GoogleAnalytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
