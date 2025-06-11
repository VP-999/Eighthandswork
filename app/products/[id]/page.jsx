"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react"

export default function ProductDetail() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const params = useParams()
  const router = useRouter()
  const { supabase } = useSupabase()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").eq("id", params.id).single()

        if (error) throw error

        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Product not found")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [supabase, params.id])

  const handleQuantityChange = (value) => {
    if (value < 1) return
    setQuantity(value)
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      // Show a toast or notification here
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Link href="/products" className="inline-flex items-center text-amber-500 hover:text-amber-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6">
              <Image
                src={product.image_url || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            <div className="p-6 flex flex-col">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-amber-500 mb-4">${product.price}</p>

              <div className="border-t border-b py-4 my-4">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6">
                <p className="font-medium mb-2">Quantity:</p>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 border rounded-l-md"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                    className="p-2 border-t border-b w-16 text-center"
                  />
                  <button onClick={() => handleQuantityChange(quantity + 1)} className="p-2 border rounded-r-md">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-auto">
                <button onClick={handleAddToCart} className="w-full btn-primary flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
