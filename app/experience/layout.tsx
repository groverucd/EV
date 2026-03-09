import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "InfraCopilot AI - Experience",
  description:
    "Cinematic journey through AI-powered predictive maintenance for EV charging infrastructure.",
};

export const viewport: Viewport = {
  themeColor: "#06080f",
  width: "device-width",
  initialScale: 1,
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
