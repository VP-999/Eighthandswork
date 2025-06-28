<<<<<<< HEAD
=======
"use client"

import React, { useState, useEffect, useRef } from "react"
>>>>>>> friend/main
import { Truck, Award, RotateCcw, HeadphonesIcon } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
<<<<<<< HEAD
      icon: <Truck className="h-8 w-8 text-amber-500" />,
=======
      iconMobile: <Truck className="h-8 w-8 text-black" />,
      iconDesktop: <Truck className="h-8 w-8 text-black" />,
>>>>>>> friend/main
      title: "Free Shipping",
      description: "On all orders above $500",
    },
    {
<<<<<<< HEAD
      icon: <Award className="h-8 w-8 text-amber-500" />,
=======
      iconMobile: <Award className="h-8 w-8 text-black" />,
      iconDesktop: <Award className="h-8 w-8 text-black" />,
>>>>>>> friend/main
      title: "Quality Assurance",
      description: "100% handcrafted quality",
    },
    {
<<<<<<< HEAD
      icon: <RotateCcw className="h-8 w-8 text-amber-500" />,
=======
      iconMobile: <RotateCcw className="h-8 w-8 text-black" />,
      iconDesktop: <RotateCcw className="h-8 w-8 text-black" />,
>>>>>>> friend/main
      title: "14-Day Returns",
      description: "Hassle-free return policy",
    },
    {
<<<<<<< HEAD
      icon: <HeadphonesIcon className="h-8 w-8 text-amber-500" />,
=======
      iconMobile: <HeadphonesIcon className="h-8 w-8 text-black" />,
      iconDesktop: <HeadphonesIcon className="h-8 w-8 text-black" />,
>>>>>>> friend/main
      title: "24/7 Support",
      description: "Dedicated customer service",
    },
  ]

<<<<<<< HEAD
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
=======
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef(null)

  // Function to handle moving to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1))
  }

  // Set up the auto-rotation
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 3000) // Change slide every 3 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Function to manually change slides
  const goToSlide = (index) => {
    setCurrentSlide(index)
    // Reset the interval when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 3000)
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Mobile view: Carousel/Slider */}
        <div className="md:hidden">
          <div className="text-center px-6 py-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white rounded-full">
                {features[currentSlide].iconMobile}
              </div>
            </div>
            <h3 className="text-sm font-bold tracking-wide mb-2">{features[currentSlide].title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{features[currentSlide].description}</p>
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentSlide ? "bg-black" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop view: Original grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 bg-white rounded-full">
                {feature.iconDesktop}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-base text-gray-600">{feature.description}</p>
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
