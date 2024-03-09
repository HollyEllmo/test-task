import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/components/Providers";
import { FileResponseProvider } from "@/components/FileContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Test Task",
  description: "Test task for Vadim Galkin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <ReactQueryProvider>
          <body
            className={cn(
              "min-h-screen font-sans antialiased",
              inter.className
            )}
          >
            <Toaster />
            <Navbar />
            {children}
          </body>
        </ReactQueryProvider>
      </html>
    </SessionProvider>
  );
}
