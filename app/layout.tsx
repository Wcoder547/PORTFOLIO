import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Waseem Akram – Full‑Stack Dev & AI Engineer',
  description: 'I build AI‑powered, full‑stack web applications.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050814] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
