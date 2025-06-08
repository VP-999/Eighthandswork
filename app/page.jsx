import Hero from "@/components/hero"
import FeaturesSection from "@/components/features-section"
import FeaturedProducts from "@/components/featured-products"
import AboutSection from "@/components/about-section"
import RoomShowcase from "@/components/room-showcase"
import Achievements from "@/components/achievements"
import ContactForm from "@/components/contact-form"

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturesSection />
      <FeaturedProducts />
      <RoomShowcase />
      <AboutSection />
      <Achievements />
      <ContactForm />
    </div>
  )
}
