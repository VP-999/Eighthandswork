"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { useCart } from "@/lib/cart-context"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react"

export default function Cart() {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()

  const handleCheckout = () => {
    setIsCheckingOut(true)

    // Pre-fill with user data if logged in
    if (user) {
      const fetchUserData = async () => {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("full_name, email, phone, address")
            .eq("id", user.id)
            .single()

          if (error) throw error

          setCheckoutData({
            fullName: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          })
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }

      fetchUserData()
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCheckoutData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user?.id || null,
            total_amount: getCartTotal(),
            shipping_address: checkoutData.address,
            phone: checkoutData.phone,
            status: "pending",
          },
        ])
        .select()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderData[0].id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/order-success?id=${orderData[0].id}`)
    } catch (error) {
      console.error("Error submitting order:", error)
      setError("There was an error processing your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex flex-col justify-center items-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-4">Product</th>
                      <th className="text-center pb-4">Quantity</th>
                      <th className="text-right pb-4">Price</th>
                      <th className="text-right pb-4">Total</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center">
                            <Image
                              src={item.image_url || "/placeholder.svg?height=80&width=80"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-md mr-4"
                            />
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 border rounded-l-md"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="p-1 border-t border-b w-12 text-center"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 border rounded-r-md"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-right">${item.price}</td>
                        <td className="py-4 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4">
              <Link href="/products" className="inline-flex items-center text-amber-500 hover:text-amber-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                {!isCheckingOut ? (
                  <button onClick={handleCheckout} className="w-full btn-primary">
                    Proceed to Checkout
                  </button>
                ) : (
                  <form onSubmit={handleSubmitOrder}>
                    <h3 className="font-bold mb-4">Shipping Information</h3>

                    {error && <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4">{error}</div>}

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={checkoutData.fullName}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={checkoutData.email}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={checkoutData.phone}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={checkoutData.address}
                          onChange={handleInputChange}
                          required
                          rows="3"
                          className="input-field"
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button type="submit" disabled={isSubmitting} className="w-full btn-primary">
                        {isSubmitting ? "Processing..." : "Place Order (Cash on Delivery)"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
