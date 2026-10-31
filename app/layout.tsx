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
  metadataBase: new URL("https://www.inusha.me"),
  title: {
    default: "Inusha Gunasekara | Cyberpunk OS 2.0 (Digital Twin)",
    template: "%s | Inusha Gunasekara",
  },
  description:
    "AI Systems Engineer & Full-Stack Developer · University of Moratuwa. Explore agentic AI projects, neural skill radar, and live telemetry.",
  keywords: [
    "Inusha Gunasekara",
    "Inusha Thathsara",
    "Inusha",
    "Cyberpunk OS",
    "Portfolio",
    "AI Systems Engineer",
    "Software Engineer Sri Lanka",
    "University of Moratuwa",
    "Full Stack Developer",
    "Agentic AI",
    "Next.js Portfolio",
  ],
  authors: [{ name: "Inusha Gunasekara", url: "https://www.inusha.me" }],
  creator: "Inusha Gunasekara",
  publisher: "Inusha Gunasekara",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.inusha.me",
  },
  openGraph: {
    title: "Inusha Gunasekara | Cyberpunk OS 2.0 (Digital Twin)",
    description:
      "Sentient Cyberpunk Web Operating System & Engineering Portfolio of Inusha Gunasekara. Multi-agent AI architectures, 3D hologram core, and project vaults.",
    url: "https://www.inusha.me",
    siteName: "Inusha Gunasekara Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inusha Gunasekara | Cyberpunk OS 2.0",
    description:
      "Sentient Cyberpunk Web Operating System & Engineering Portfolio of Inusha Gunasekara.",
    creator: "@inusha_thathsara",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Inusha Gunasekara",
  alternateName: ["Malawige Inusha Thathsara Gunasekara", "Inusha Thathsara"],
  url: "https://www.inusha.me",
  jobTitle: "AI Systems Engineer & Full Stack Developer",
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "University of Moratuwa",
  },
  sameAs: [
    "https://github.com/inusha-thathsara",
    "https://linkedin.com/in/inusha-gunasekara-9996632a5",
    "https://dev.to/inushathathsara",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased bg-[#06080f] text-gray-200`}
        suppressHydrationWarning
      >
        <SystemProvider>
          <GlitchWrapper>{children}</GlitchWrapper>
        </SystemProvider>
      </body>
    </html>
  );
}
