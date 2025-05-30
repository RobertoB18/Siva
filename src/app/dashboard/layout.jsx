import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import StoreNav from "@/components/StoreNav";
import { StoreProvider } from "@/Context/newStoreContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <>
      
      <div className="flex h-screen">
          <StoreProvider>
            
            <StoreNav />
            <NavBar />
            <main className="w-full overflow-y-auto">
            <Toaster position="top-right" reverseOrder={false}/>
              {children}
            </main>
          </StoreProvider>
        </div>
    </>
        
  );
}
