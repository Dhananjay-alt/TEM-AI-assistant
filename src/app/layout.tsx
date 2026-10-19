import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

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
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#0F172A] selection:bg-[#FF5722] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
