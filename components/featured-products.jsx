"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSupabase } from "@/lib/supabase-provider"
import { useCart } from "@/lib/cart-context"
import { productsAPI } from "@/lib/database"
import { ShoppingCart } from "lucide-react"

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isInitialized } = useSupabase()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isInitialized) return

      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await productsAPI.getAll({ limit: 12 })

        if (fetchError) {
          setError(fetchError)
        } else {
          setProducts(data)
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [isInitialized])

  const handleAddToCart = (product) => {
    try {
      addToCart(product)
      // You could replace this with a toast notification
      alert(`${product.name} added to cart!`)
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add product to cart")
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Featured Products</h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Featured Products</h2>
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">Failed to load products</p>
            <p className="text-gray-500">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Featured Products</h2>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="card group">
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=300&width=400"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=300&width=400"
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="absolute bottom-4 right-4 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-amber-500">
                      ${Number.parseFloat(product.price || 0).toFixed(2)}
                    </span>
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

        <div className="text-center mt-12">
          <Link href="/products" className="btn-outline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
