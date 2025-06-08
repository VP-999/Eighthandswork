import Link from "next/link"
import Image from "next/image"

export default function RoomShowcase() {
  const rooms = [
    {
      name: "Living Room",
      image: "/hero-bg.png",
      category: "Living Room Set",
      description: "Elegant and comfortable living room furniture for your home",
    },
    {
      name: "Bedroom",
      image: "/product1.png",
      category: "Bedroom Set",
      description: "Stylish bedroom furniture for a peaceful night's sleep",
    },
    {
      name: "Dining Room",
      image: "/product2.png",
      category: "Dining Table",
      description: "Beautiful dining sets for memorable family gatherings",
    },
    {
      name: "Kid's Room",
      image: "/hero-bg.png",
      category: "Bedroom Set",
      description: "Colorful and functional furniture for children's rooms",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-12">Explore Our Room Collections</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room, index) => (
            <Link
              key={index}
              href={`/products?category=${encodeURIComponent(room.category)}`}
              className="group relative overflow-hidden rounded-lg shadow-lg h-80"
            >
              <Image
                src={room.image || "/placeholder.svg"}
                alt={room.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <div className="bg-white/80 backdrop-blur-sm text-gray-900 py-2 px-6 rounded-md mb-3">
                  <h3 className="text-xl font-bold">{room.name}</h3>
                </div>
                <p className="text-center text-white text-shadow hidden md:block">{room.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
