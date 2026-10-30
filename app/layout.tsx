import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SystemProvider } from "./context/SystemContext";
import GlitchWrapper from "./components/effects/GlitchWrapper";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inusha Gunasekara | Cyberpunk OS 2.0 (Digital Twin)",
  description:
    "AI Systems Engineer & Full-Stack Developer - University of Moratuwa. Explore agentic AI projects, neural skill radar, and live telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased bg-[#06080f] text-gray-200`}
      >
        <SystemProvider>
          <GlitchWrapper>{children}</GlitchWrapper>
        </SystemProvider>
      </body>
    </html>
  );
}
