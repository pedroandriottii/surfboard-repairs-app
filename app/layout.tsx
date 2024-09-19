import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Realce Nordeste",
  description: "Consertos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon32.png" />
      </head>
      <body className={`${inter.className} h-screen w-screen overflow-x-hidden`}>
        {children}
        <SpeedInsights />
      </body>
    </html >
  );
}
