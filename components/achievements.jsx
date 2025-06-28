<<<<<<< HEAD
export default function Achievements() {
  const achievements = [
    { name: "Bangladesh Navy", description: "Provided custom furniture solutions" },
    { name: "Pizzaburg", description: "Furnished restaurant interiors" },
    { name: "Roofliners", description: "Collaborated on architectural projects" },
    { name: "Abedin Equipment Ltd", description: "Supplied custom furniture" },
    { name: "KC", description: "Designed and delivered premium furniture" },
    { name: "Ecowood Ltd", description: "Partnered for sustainable furniture" },
    { name: "Minimal", description: "Created minimalist design pieces" },
    { name: "Navana Furniture", description: "Collaborated on luxury collections" },
    { name: "Orchid Architect LTD", description: "Provided architectural furniture" },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="section-title">Our Clients</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          We have successfully worked with numerous prestigious clients across various industries, delivering
          exceptional quality and service.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">{achievement.name}</h3>
              <p className="text-gray-600">{achievement.description}</p>
=======
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
>>>>>>> friend/main
            </div>
          ))}
        </div>
      </div>
    </section>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> friend/main
