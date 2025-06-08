import { Truck, Award, RotateCcw, HeadphonesIcon } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-amber-500" />,
      title: "Free Shipping",
      description: "On all orders above $500",
    },
    {
      icon: <Award className="h-8 w-8 text-amber-500" />,
      title: "Quality Assurance",
      description: "100% handcrafted quality",
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-amber-500" />,
      title: "14-Day Returns",
      description: "Hassle-free return policy",
    },
    {
      icon: <HeadphonesIcon className="h-8 w-8 text-amber-500" />,
      title: "24/7 Support",
      description: "Dedicated customer service",
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 bg-amber-100 rounded-full">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
