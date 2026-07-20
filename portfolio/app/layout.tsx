import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Eric Adokou — Développeur Full Stack",
  description:
    "Portfolio d'Eric Adokou, développeur Full Stack basé à Lomé, Togo. Spécialisé en React, Next.js et design d'interfaces premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#080C14] text-[#F0EDE8] font-body antialiased">
        {children}
      </body>
    </html>
  );
}
