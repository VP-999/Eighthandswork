"use client";

import Link from "next/link";

export default function FurnitureCategories() {
  const categories = [
    {
      name: "Night Stands",
      icon: "/icon/night-stand.png",
      description: "Perfect bedside companions for storage and style",
      link: "/products?category=night-stand"
    },
    {
      name: "Armchairs",
      icon: "/icon/armchair.png",
      description: "Comfortable seating with elegant designs",
      link: "/products?category=armchair"
    },
    {
      name: "Desks",
      icon: "/icon/desk.png",
      description: "Functional workspaces for home and office",
      link: "/products?category=desk"
    }
  ];

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-light text-center mb-8">
          Featured Categories
        </h2>

        <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-3xl mx-auto">
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