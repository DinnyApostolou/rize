import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rize — Train Like A Pro",
  description: "The ultimate basketball and gym training app for serious athletes. Drills, strength programs, nutrition — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
