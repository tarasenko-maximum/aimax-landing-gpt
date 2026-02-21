import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIMAX — AI agents for real business",
  description: "Landing + AI agent widget demo (Next.js App Router).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg" />
        {children}
      </body>
    </html>
  );
}