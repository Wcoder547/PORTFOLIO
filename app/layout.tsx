import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Chatbot } from "@/components/sections/Chatbot";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waseem Akram – Full-Stack Developer",
  description: "Full-Stack Developer from Pakistan specialising in MERN, Next.js, and AI-integrated web applications.",
  icons: {
  icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'><rect width='120' height='60' fill='%230d0d0d'/><text x='60' y='42' font-size='32' font-family='serif' fill='white' text-anchor='middle'>وسیم</text></svg>",
},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider signInUrl="/admin/sign-in">
      <html lang="en">
        <body className="min-h-screen bg-[#0d0d0d] text-[#f0f0f0] antialiased grid-bg">
          {children}
          <Chatbot />
        </body>
      </html>
    </ClerkProvider>
  );
}