"use client";

import Link from "next/link";

export default function FurnitureCategories() {
  const categories = [
    {
      name: "Epoxy Table",
      icon: "/icon/desk.png",
      description: "Stylish epoxy resin tables with unique designs",
      link: "/products?category=epoxy-table"
    },
    {
      name: "Epoxy Chair",
      icon: "/icon/night-stand.png",
      description: "Elegant and comfortable epoxy resin chairs",
      link: "/products?category=epoxy-chair"
    },
    {
      name: "Sofa",
      icon: "/icon/armchair.png", // Using night-stand icon as placeholder for sofa
      description: "Luxurious and comfortable sofas for your living room",
      link: "/products?category=sofa"
    },
    {
      name: "Interior",
      icon: "/icon/intorior.png",
      description: "Complete interior design solutions for your space",
      link: "/products?category=interior"
    }
  ];

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-light text-center mb-8">
          Featured Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <Link
              href={category.link}
              key={index}
              className="flex flex-col items-center group"
            >
              <div className="bg-white rounded-lg p-3 md:p-6 w-full shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-center mb-2 md:mb-4">
                  <img 
                    src={category.icon} 
                    alt={category.name} 
                    className="h-12 md:h-16 w-auto object-contain"
                  />
                </div>
                <h3 className="text-xs md:text-lg font-medium text-center text-gray-800 mb-1 md:mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-center text-[10px] md:text-xs line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}