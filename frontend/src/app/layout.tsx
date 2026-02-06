import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ask Marco | AI QA Engineer",
  description:
    "Chat with an AI assistant to learn about Marco experience as a QA Engineer with expertise in Quality Assurance, test automation, Playwright, and AI testing.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Ask Marco | AI QA Engineer",
    description:
      "Chat with an AI assistant to learn about Marco experience as a QA Engineer with expertise in Quality Assurance, test automation, Playwright, and AI testing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
