import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "TEM-AI — Transmission Electron Microscopy Intelligence",
  description:
    "An AI-powered educational and laboratory assistant grounded in David B. Williams & C. Barry Carter's TEM textbook. Featuring interactive diffraction simulations, particle analysis, and exam prep.",
  keywords: [
    "Transmission Electron Microscopy",
    "TEM",
    "Barry Carter",
    "Electron Diffraction",
    "SAED",
    "HRTEM",
    "Materials Science",
    "Ewald Sphere",
    "Bright Field",
    "Dark Field",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F4E8] text-[#09090B] font-grotesk selection:bg-[#D2E823] selection:text-[#09090B] relative">
        {/* Global SVG Noise Overlay (3% opacity) */}
        <div className="fixed inset-0 pointer-events-none bg-noise z-30 opacity-70" aria-hidden="true" />

        {/* Interactive Custom Mix-Blend Cursor */}
        <CustomCursor />

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
