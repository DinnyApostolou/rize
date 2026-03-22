import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthRedirect from "./AuthRedirect";

export const metadata: Metadata = {
  title: "Rize — Train Like A Pro",
  description: "The ultimate basketball and gym training app for serious athletes. Drills, strength programs, nutrition — all in one place.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthRedirect />
        {children}
      </body>
    </html>
  );
}
