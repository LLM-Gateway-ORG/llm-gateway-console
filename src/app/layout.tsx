import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// Reference :- https://react-hot-toast.com/
import { Toaster } from "react-hot-toast"
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LLM Gateway",
  description: "One stop solution for all your LLM needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        <GoogleAnalytics gaId={`${process.env.NEXT_GOOGLE_ANALYTICS_ID}`} />
      </body>
    </html>
  );
}
