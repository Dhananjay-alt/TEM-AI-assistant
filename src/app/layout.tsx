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
          href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#050505] text-white font-sans selection:bg-[#FF4500] selection:text-white relative antialiased">
        {/* Global SVG Noise Overlay (subtle surrealist texture) */}
        <div className="fixed inset-0 pointer-events-none bg-noise z-30 opacity-20" aria-hidden="true" />

        {/* Interactive Custom Mix-Blend Cursor */}
        <CustomCursor />

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
