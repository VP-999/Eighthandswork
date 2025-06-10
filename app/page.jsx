import Hero from "@/components/hero"
import FeaturesSection from "@/components/features-section"
import TrendyProducts from "@/components/trendy-products"
import AboutSection from "@/components/about-section"
import RoomShowcase from "@/components/room-showcase"
import Achievements from "@/components/achievements"
import ContactForm from "@/components/contact-form"

// Sample products data to use temporarily
const sampleProducts = [
	{
		id: '1',
		name: 'Boca Da Lobo Erosion Ring',
		description: 'Luxury designer ring table with unique erosion style',
		price: 120.00,
		discount_price: 90.00,
		category: 'Center Table',
		image_url: '/images/products/erosion-ring.jpg',
		is_new: true,
		is_featured: false,
		is_bestseller: true
	},
	{
		id: '2',
		name: 'Brenwen Sheepskin Stool',
		description: 'Modern stool with soft sheepskin top and gold base',
		price: 56.99,
		discount_price: 46.99,
		category: 'Stool',
		image_url: '/images/products/sheepskin-stool.jpg',
		is_new: true,
		is_featured: true,
		is_bestseller: false
	},
	// Add more sample products as needed
];

export default function Home() {
	// We'll use sample products instead of fetching from Supabase
	const products = sampleProducts;

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
