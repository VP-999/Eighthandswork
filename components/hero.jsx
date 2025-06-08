import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <Image src="/hero-bg.png" alt="Luxury Epoxy Furniture" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <Image src="/logo.png" alt="Eight Hands Work" width={300} height={120} className="mb-8 brightness-0 invert" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Luxury Epoxy Furniture</h1>
        <p className="text-xl md:text-2xl max-w-3xl mb-8">
          Handcrafted with precision and passion since 2017. Experience the perfect blend of artistry and functionality.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/products" className="btn-primary text-lg px-8 py-3">
            Explore Collection
          </Link>
          <Link href="/contact" className="btn-outline text-lg px-8 py-3">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
