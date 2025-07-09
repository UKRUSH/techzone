import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { PageStateProvider } from "@/components/providers/PageStateProvider";
import { InstantDataProvider } from "@/components/providers/InstantDataProvider";
import { ToastContainer } from "@/components/ui/toast";
import { NavigationProgress, RoutePrefetcher } from "@/components/navigation/FastNavigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ReactQueryProvider>
          <InstantDataProvider>
            <AuthProvider>
              <PageStateProvider>
                <LoadingProvider>
                  <CartProvider>
                    <NavigationProgress />
                    <RoutePrefetcher />
                    <Header />
                    <main className="min-h-screen">
                      {children}
                    </main>
                    <Footer />
                    <ToastContainer />
                  </CartProvider>
                </LoadingProvider>
              </PageStateProvider>
            </AuthProvider>
          </InstantDataProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}