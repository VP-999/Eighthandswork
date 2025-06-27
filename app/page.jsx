import { supabase } from '@/lib/supabase-client'; 
import Hero from "@/components/hero"
import FeaturesSection from "@/components/features-section"
import TrendyProducts from "@/components/trendy-products"
import AboutSection from "@/components/about-section"
import RoomShowcase from "@/components/room-showcase"
import Achievements from "@/components/achievements"
import ContactForm from "@/components/contact-form"
import FurnitureCategories from "@/components/furniture-categories" // Fixed import path

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
      <FurnitureCategories /> 
      <TrendyProducts products={products} />
      <RoomShowcase />
      <AboutSection />
      <Achievements />
      <ContactForm />
      <FeaturesSection />
    </div>
  )
}