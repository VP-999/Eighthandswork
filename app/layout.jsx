

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SupabaseProvider } from "@/lib/supabase-provider";
import { CartProvider } from "@/lib/cart-context";
import SmoothScroll from "@/components/smooth-scroll"; // We'll create this component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Eight Hands Work - Luxury Epoxy Furniture",
  description: "Premium custom epoxy furniture crafted with excellence since 2017",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SupabaseProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <SmoothScroll /> {/* Client component for smooth scrolling */}
            </div>
          </CartProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
