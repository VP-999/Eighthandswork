import { Truck, Award, RotateCcw, HeadphonesIcon } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      iconMobile: <Truck className="h-3 w-3 text-amber-500" />,
      iconDesktop: <Truck className="h-8 w-8 text-amber-500" />,
      title: "Free Shipping",
      description: "On all orders above $500",
    },
    {
      iconMobile: <Award className="h-3 w-3 text-amber-500" />,
      iconDesktop: <Award className="h-8 w-8 text-amber-500" />,
      title: "Quality Assurance",
      description: "100% handcrafted quality",
    },
    {
      iconMobile: <RotateCcw className="h-3 w-3 text-amber-500" />,
      iconDesktop: <RotateCcw className="h-8 w-8 text-amber-500" />,
      title: "14-Day Returns",
      description: "Hassle-free return policy",
    },
    {
      iconMobile: <HeadphonesIcon className="h-3 w-3 text-amber-500" />,
      iconDesktop: <HeadphonesIcon className="h-8 w-8 text-amber-500" />,
      title: "24/7 Support",
      description: "Dedicated customer service",
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Mobile view: Flex row with all 4 items in one line */}
        <div className="flex flex-row justify-between md:hidden">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-1 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow w-[23%]"
            >
              <div className="mb-1 p-1 bg-amber-100 rounded-full">
                {feature.iconMobile}
              </div>
              <h3 className="text-[10px] font-bold leading-tight">{feature.title}</h3>
              <p className="text-[8px] text-gray-600 leading-tight">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Desktop view: Original grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 bg-amber-100 rounded-full">
                {feature.iconDesktop}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}