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
  title: "AirZone - 에어컨 전문 쇼핑몰",
  description: "최고의 에어컨을 합리적인 가격에 만나보세요. 삼성, LG, 캐리어 등 주요 브랜드 에어컨 전문 쇼핑몰",
  keywords: "에어컨, 삼성에어컨, LG에어컨, 캐리어에어컨, 벽걸이형, 스탠드형, 인버터에어컨",
  authors: [{ name: "AirZone Team" }],
  robots: "index, follow",
  openGraph: {
    title: "AirZone - 에어컨 전문 쇼핑몰",
    description: "최고의 에어컨을 합리적인 가격에 만나보세요",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
