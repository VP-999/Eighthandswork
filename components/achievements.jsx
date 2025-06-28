"use client";

import { useState } from "react";

export default function Achievements() {
  const [fallbacks, setFallbacks] = useState({});
  
  const clients = [
    { 
      name: "Bangladesh Navy", 
      logo: "/logos/navy.png" 
    },
    { 
      name: "Pizzaburg", 
      logo: "/logos/pizzabug.png" 
    },
    { 
      name: "Roofliners", 
      logo: "/logos/roofliner.jpeg" 
    },
    { 
      name: "Abedin Equipment Ltd", 
      logo: "/logos/abedin.png" 
    },
    { 
      name: "KC", 
      logo: "/logos/kc.jpg"
    },
    { 
      name: "Ecowood Ltd", 
      logo: "/logos/ecowood.png" 
    },
    { 
      name: "Navana Furniture", 
      logo: "/logos/navaba.png" 
    },
    { 
      name: "Orchid Architect LTD", 
      logo: "/logos/orchid.png" 
    },
  ]

  const handleImageError = (index) => {
    setFallbacks(prev => ({
      ...prev,
      [index]: true
    }));
  };

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-6 md:mb-10">Our Clients</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {clients.map((client, index) => (
            <div 
              key={index} 
              className="bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center p-4 md:p-6 h-28 md:h-40"
            >
              <div className="relative w-full h-14 md:h-20 mb-2 md:mb-4 flex items-center justify-center">
                {!fallbacks[index] ? (
                  <img 
                    src={client.logo} 
                    alt={`${client.name} logo`} 
                    className="max-h-full max-w-full object-contain"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="text-center font-medium text-gray-800 text-lg md:text-xl">
                    {client.name.split(' ')[0]}
                  </div>
                )}
              </div>
              <p className="text-xs md:text-sm text-center text-gray-600 font-medium">
                {client.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}