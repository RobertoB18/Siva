import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SIVA",
  description: "Sistema de ventas y administracion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
      <body>
        <Providers>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
