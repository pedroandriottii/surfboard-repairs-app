import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { fontGrid } from "@mui/material/styles/cssUtils";

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
  const session = await auth();

  return (
    <SessionProvider session={session} >
      <html lang="pt-br">
        <head>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon32.png" />
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </SessionProvider >
  );
}
