import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import LeftSideBar from "@/components/shared/Leftsidebar";
import RightSideBar from "@/components/shared/Rightsidebar";
import { Metadata } from "next";
import React from "react";
import TopBar from "@/components/shared/Topbar";
import BottomBar from "@/components/shared/Bottombar";
import "../globals.css";

export const metadata: Metadata = {
  title: "Threads Clone",
  description: "Threads Clone created by Akezhan Bexeitov",
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
        <body className={inter.className}>
          <TopBar />

          <main>
            <LeftSideBar />

            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>

            <RightSideBar />
          </main>

          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
