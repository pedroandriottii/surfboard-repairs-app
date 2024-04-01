import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

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
        <body className="bg-[#D0D5DD]">
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
