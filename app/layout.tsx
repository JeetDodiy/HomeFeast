import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/Toaster";

export const viewport: Viewport = {
  themeColor: "#E8650A",
};

export const metadata: Metadata = {
  title: "HomeFeast – Homemade Tiffin & Food Service Platform",
  description:
    "Connect with verified home cooks offering fresh, hygienic, home-style meals on daily, weekly, or monthly subscriptions. Serving Rajkot, Ahmedabad and more cities.",
  keywords:
    "homemade food, tiffin service, home cook, meal subscription, daily tiffin, Rajkot tiffin, Ahmedabad tiffin",
  manifest: "/manifest.json",
  openGraph: {
    title: "HomeFeast – Homemade Tiffin & Food Service",
    description: "Fresh homemade meals delivered to your door. Subscribe today.",
    type: "website",
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
                  var theme = localStorage.getItem('homefeast-theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
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
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <MobileBottomNav />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
