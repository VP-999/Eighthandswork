<<<<<<< HEAD
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { SupabaseProvider } from "@/lib/supabase-provider"
import { CartProvider } from "@/lib/cart-context"

const inter = Inter({ subsets: ["latin"] })
=======


import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SupabaseProvider } from "@/lib/supabase-provider";
import { CartProvider } from "@/lib/cart-context";
import SmoothScroll from "@/components/smooth-scroll"; // We'll create this component

const inter = Inter({ subsets: ["latin"] });
>>>>>>> friend/main

export const metadata = {
  title: "Eight Hands Work - Luxury Epoxy Furniture",
  description: "Premium custom epoxy furniture crafted with excellence since 2017",
<<<<<<< HEAD
    generator: 'v0.dev'
=======
  generator: 'v0.dev'
>>>>>>> friend/main
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
<<<<<<< HEAD
=======
              <SmoothScroll /> {/* Client component for smooth scrolling */}
>>>>>>> friend/main
            </div>
          </CartProvider>
        </SupabaseProvider>
      </body>
    </html>
<<<<<<< HEAD
  )
=======
  );
>>>>>>> friend/main
}
