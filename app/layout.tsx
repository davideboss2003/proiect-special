import React from "react"
import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit, Patrick_Hand } from 'next/font/google'
import './globals.css'
import './flowers.css'

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});
const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-outfit" });
const patrickHand = Patrick_Hand({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-patrick",
});

export const metadata: Metadata = {
  title: 'Proiect Special - Pentru Andreea Solomon',
  description: 'Un proiect special dedicat viitoarei doamne inginer Andreea Solomon',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" className={`${cormorant.variable} ${outfit.variable} ${patrickHand.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
