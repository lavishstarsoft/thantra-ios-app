import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ios-styles.css";

export const metadata: Metadata = {
  title: "Thantra Astro",
  description: "Thantra Astro — Learn Astrology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="ios-webview-container bg-[#f2f2f7]">{children}</body>
    </html>
  );
}
