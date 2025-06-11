"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { CheckCircle } from "lucide-react"

export default function OrderSuccess() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const { supabase } = useSupabase()

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

        if (error) throw error

        setOrder(data)
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [supabase, orderId])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
        <Link href="/" className="btn-primary">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">
              Thank you for your order. We've received your request and will process it shortly.
            </p>
          </div>

          <div className="border-t border-b py-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Order ID:</span>
              <span>{order.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Order Date:</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Order Status:</span>
              <span className="capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold">${order.total_amount}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            We'll send you an email confirmation with details of your order. If you have any questions, please contact
            our customer service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary text-center">
              Return to Home
            </Link>
            <Link href="/orders" className="btn-outline text-center">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
