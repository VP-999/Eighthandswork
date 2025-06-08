"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Filter, Search, ChevronRight } from "lucide-react"

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { supabase, isInitialized } = useSupabase()
  const { addToCart } = useCart()
  const searchParams = useSearchParams()

  // Category groups for sidebar organization
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
    // Get category from URL if present
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isInitialized) return

      try {
        setError(null)
        let query = supabase.from("products").select("*")

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory)
        }

        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`)
        }

        const { data, error: supabaseError } = await query

        if (supabaseError) {
          throw supabaseError
        }

        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please check your Supabase configuration.")
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      if (!isInitialized) return

      try {
        const { data, error: supabaseError } = await supabase.from("categories").select("name").order("name")

        if (supabaseError) {
          throw supabaseError
        }

        setCategories(data?.map((cat) => cat.name) || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        // We don't set the error state here to avoid blocking the product display
      }
    }

    if (isInitialized) {
      fetchProducts()
      fetchCategories()
    }
  }, [supabase, selectedCategory, searchQuery, isInitialized])

  const handleSearch = (e) => {
    e.preventDefault()
    // The search is already handled by the useEffect dependency
  }

  // Function to check if a category exists in our database
  const categoryExists = (categoryName) => {
    return categories.includes(categoryName)
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Categories
              </h2>

              <div className="mb-4">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === "all" ? "bg-amber-500 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  All Products
                </button>
              </div>

              {/* Category groups */}
              {Object.entries(categoryGroups).map(([groupName, groupCategories]) => {
                // Only show groups that have at least one category in our database
                const existingCategories = groupCategories.filter(categoryExists)
                if (existingCategories.length === 0) return null

                return (
                  <div key={groupName} className="mb-4">
                    <h3 className="font-medium text-gray-500 text-sm uppercase mb-2">{groupName}</h3>
                    <div className="space-y-1 pl-2">
                      {existingCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`flex items-center w-full text-left px-3 py-1.5 rounded-md ${
                            selectedCategory === category ? "bg-amber-500 text-white" : "hover:bg-gray-100"
                          }`}
                        >
                          <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search
              </h2>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <p className="text-gray-500">Please check your Supabase configuration or try again later.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 text-lg mb-4">No products found.</p>
                <p className="text-gray-500">Try changing your search criteria or check back later for new products.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                    <div className="relative overflow-hidden">
                      <Image
                        src={product.image_url || "/placeholder.svg?height=300&width=400"}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                      <button
                        onClick={() => addToCart(product)}
                        className="absolute bottom-4 right-4 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-amber-500">${product.price}</span>
                        <Link
                          href={`/products/${product.id}`}
                          className="text-sm text-gray-500 hover:text-amber-500 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
