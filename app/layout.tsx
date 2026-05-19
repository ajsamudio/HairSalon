import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { clientConfig } from "@/client.config";
import "./globals.css";

const fontHeading = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: clientConfig.seo.title,
  description: clientConfig.seo.description,
  openGraph: {
    title: clientConfig.seo.title,
    description: clientConfig.seo.description,
    images: [clientConfig.seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontHeading.variable} ${fontBody.variable}`}>
      <body>{children}</body>
    </html>
  );
}
