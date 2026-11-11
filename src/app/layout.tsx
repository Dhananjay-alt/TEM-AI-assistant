import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "TEM-AI — Transmission electron microscopy reference assistant",
  description:
    "A study and reference assistant for transmission electron microscopy. Answers cite the textbook passage they come from, and each citation opens the source page.",
  keywords: [
    "Transmission Electron Microscopy",
    "TEM",
    "Electron Diffraction",
    "SAED",
    "HRTEM",
    "Materials Science",
  ],
};

// Applies the saved theme before first paint so the page does not flash.
const themeScript = `(function(){var t='light';try{var s=localStorage.getItem('tem-theme');if(s==='dark'||s==='light')t=s;}catch(e){}document.documentElement.dataset.theme=t;})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
