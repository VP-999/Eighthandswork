import { supabase } from '@/lib/supabase-client'; // Changed from '@/lib/supabase'
import Hero from "@/components/hero"
import FeaturesSection from "@/components/features-section"
import TrendyProducts from "@/components/trendy-products"
import AboutSection from "@/components/about-section"
import RoomShowcase from "@/components/room-showcase"
import Achievements from "@/components/achievements"
import ContactForm from "@/components/contact-form"

export default async function Home() {
  let products = [];
  
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error("Supabase error:", error);
    } else {
      products = data || [];
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
  
  return (
    <div>
      <Hero />
      <FeaturesSection />
      <TrendyProducts products={products} />
      <RoomShowcase />
      <AboutSection />
      <Achievements />
      <ContactForm />
    </div>
  )
}
