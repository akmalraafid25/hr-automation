import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { POPPINS } from "./fonts/poppins"
import { ToastProvider } from "@/components/ui/toast"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Modern comprehensive dashboard interface",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${POPPINS.variable}`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
