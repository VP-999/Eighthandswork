import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <video 
          autoPlay 
          loop 
          muted 
          className="object-cover w-full h-full"
        >
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-wider">
          Design Studio <span className="mx-2">-</span> furniture <span className="mx-2">-</span> Interior
        </h1>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-10">
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
