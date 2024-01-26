import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";
import React from "react";

export const metadata = {
  title: "Threads Clone",
  description: "A Next.js 13 Threads Clone Auth",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div
            className="flex w-full items-center justify-center"
            style={{ minHeight: "100svh" }}
          >
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
