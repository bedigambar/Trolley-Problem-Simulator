import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Trolley Problem — An Ethical Dilemma Simulator",
  description:
    "Explore moral philosophy through interactive ethical dilemmas. Discover whether you lean utilitarian or deontological.",
  keywords: [
    "trolley problem",
    "ethics",
    "moral philosophy",
    "utilitarian",
    "deontological",
    "ethical dilemma",
    "thought experiment",
    "philosophy",
  ],
  authors: [{ name: "Trolley Problem Simulator" }],
  creator: "Trolley Problem Simulator",
  metadataBase: new URL("https://trolley-problem-simulator.vercel.app/"),
  openGraph: {
    title: "The Trolley Problem — An Ethical Dilemma Simulator",
    description:
      "Explore moral philosophy through interactive ethical dilemmas. Discover whether you lean utilitarian or deontological.",
    url: "https://trolley-problem.vercel.app",
    siteName: "The Trolley Problem",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Trolley Problem — An Ethical Dilemma Simulator",
    description:
      "Explore moral philosophy through interactive ethical dilemmas. Discover whether you lean utilitarian or deontological.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
