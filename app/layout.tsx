import type { Metadata } from "next";
import { Chatbot } from "@/components/sections/Chatbot";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
export const metadata: Metadata = {
  title: "Waseem Akram – Full‑Stack Dev & AI Engineer",
  description: "I build AI‑powered, full‑stack web applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-[#050814] text-white antialiased">
          {children}
          <Chatbot />
        </body>
      </html>
    </ClerkProvider>
  );
}
