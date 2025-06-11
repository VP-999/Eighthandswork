"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSupabase } from "@/lib/supabase-provider"
import { ChevronRight } from "lucide-react"

export default function MegaMenu({ onClose }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { supabase } = useSupabase()

  // Define room-based category groups
  const categoryGroups = {
    "Living Room": [
      "Epoxy Table",
      "Center Table",
      "Sofa/Couch/Bean",
      "End Table",
      "Arm Chair",
      "TV Cabinet",
      "Display Cabinet",
      "Shelf",
      "Carpet/Rug",
      "Lamp/Light/Chandelier",
      "Living Room Set",
    ],
    Dining: ["Dining Table", "Dining Chair", "Dinner Wagon", "Fine Dining Furniture"],
    Bedroom: ["Bed", "Murphy Bed", "Bed Side Table", "Dressing Table", "Bedroom Set"],
    Office: [
      "Study Table",
      "Office Desk",
      "Conference Table",
      "Modular Work Station",
      "Visitor Chair",
      "Break Room Furniture",
      "Office Set",
    ],
    Storage: ["Cabinet/Almira", "Book Shelf", "Shoe Rack", "Store Cabinet"],
    Restaurant: ["Fine Dining Furniture", "Reception Furniture", "Bar Stool", "Cash Counter", "Restaurant Set"],
    Industrial: ["PU Flooring", "Lab Clear Coat", "Industrial Solutions"],
    Interior: ["Interior Consultation", "Project Execution", "Epoxy Services", "Portable Partition"],
    "Kitchen & Bath": ["Kitchen Counter Top", "Wooden Wash Basin"],
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("categories").select("name").order("name")

        if (error) throw error

        setCategories(data?.map((cat) => cat.name) || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [supabase])

  // Function to check if a category exists in our database
  const categoryExists = (categoryName) => {
    return categories.includes(categoryName)
  }

  // Filter out empty category groups
  const filteredCategoryGroups = Object.entries(categoryGroups).filter(([_, groupCategories]) => {
    return groupCategories.some(categoryExists)
  })

  if (loading) {
    return (
      <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg z-50 p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-full left-0 w-screen bg-white shadow-xl rounded-b-lg z-50">
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCategoryGroups.map(([groupName, groupCategories]) => {
            const existingCategories = groupCategories.filter(categoryExists)

            return (
              <div key={groupName} className="space-y-3">
                <h3 className="text-lg font-bold text-amber-600 border-b pb-2">{groupName}</h3>
                <ul className="space-y-2">
                  {existingCategories.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/products?category=${encodeURIComponent(category)}`}
                        className="flex items-center text-gray-700 hover:text-amber-500 transition-colors"
                        onClick={onClose}
                      >
                        <ChevronRight className="h-4 w-4 mr-1 text-amber-400" />
                        <span>{category}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            onClick={onClose}
          >
            View All Products
          </Link>

          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
