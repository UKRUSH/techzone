import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { ToastContainer } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TechZone - PC Components & Hardware Store",
  description: "Your one-stop shop for PC components, hardware, and custom build services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <ToastContainer />
            </CartProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}