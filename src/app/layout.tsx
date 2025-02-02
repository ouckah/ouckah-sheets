import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ouckah Sheets",
  description: "Track and manage your job applications",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}

