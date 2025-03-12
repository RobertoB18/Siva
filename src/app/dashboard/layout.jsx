import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import StoreNav from "@/components/StoreNav";
import "./globals.css";

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen">
          <NavBar />
          <main className="w-full overflow-y-auto">
          {children}
          </main>
        </div>
      </body>
    </html>
  );
}
