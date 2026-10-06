import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriSight AI - Investigation Intelligence Operating System",
  description: "Next-generation classified AI command center and fraud ring intelligence platform.",
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en" className="dark h-full antialiased scroll-smooth">
      <head>
        <meta name="theme-color" content="#03050d" />
      </head>
      <body className="min-h-full flex flex-col bg-[#03050d] text-slate-100 selection:bg-indigo-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

