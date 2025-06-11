"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { ShoppingBag, Users, Package, MessageSquare, Tag, Plus, LayoutDashboard } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalMessages: 0,
    totalCategories: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { supabase, user, loading: userLoading } = useSupabase()

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        if (!userLoading) {
          router.push("/login?redirect=/admin/dashboard")
        }
        return
      }

      try {
        const { data, error } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

        if (error) throw error

        if (!data.is_admin) {
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/")
      }
    }

    if (!userLoading) {
      checkAdmin()
    }
  }, [supabase, user, userLoading, router])

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        // Get total orders
        const { count: ordersCount, error: ordersError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })

        if (ordersError) throw ordersError

        // Get total products
        const { count: productsCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        if (productsError) throw productsError

        // Get total users
        const { count: usersCount, error: usersError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })

        if (usersError) throw usersError

        // Get total messages
        const { count: messagesCount, error: messagesError } = await supabase
          .from("contact_messages")
          .select("*", { count: "exact", head: true })

        if (messagesError) throw messagesError

        // Get total categories
        const { count: categoriesCount, error: categoriesError } = await supabase
          .from("categories")
          .select("*", { count: "exact", head: true })

        if (categoriesError) throw categoriesError

        setStats({
          totalOrders: ordersCount,
          totalProducts: productsCount,
          totalUsers: usersCount,
          totalMessages: messagesCount,
          totalCategories: categoriesCount,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [supabase, user])

  if (userLoading || loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!user) {
    return null // Redirect handled in useEffect
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <LayoutDashboard className="h-6 w-6 text-amber-500 mr-2" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Welcome to the admin dashboard. Here you can manage products, orders, users, and more.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/admin/products/new" className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Link>
          <Link href="/admin/categories" className="btn-outline flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Manage Categories
          </Link>
          <Link href="/admin/orders" className="btn-outline flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            View Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-500 mr-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
            <Link href="/admin/orders" className="mt-4 inline-block text-sm text-amber-500 hover:text-amber-600">
              Manage orders →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <Package className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
            <Link href="/admin/products" className="mt-4 inline-block text-sm text-amber-500 hover:text-amber-600">
              Manage products →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
            <Link href="/admin/users" className="mt-4 inline-block text-sm text-amber-500 hover:text-amber-600">
              Manage users →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Messages</p>
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
              </div>
            </div>
            <Link href="/admin/messages" className="mt-4 inline-block text-sm text-amber-500 hover:text-amber-600">
              View messages →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                <Tag className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-2xl font-bold">{stats.totalCategories}</p>
              </div>
            </div>
            <Link href="/admin/categories" className="mt-4 inline-block text-sm text-amber-500 hover:text-amber-600">
              Manage categories →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-bold">Recent Orders</h2>
            </div>
            <div className="p-6">
              {/* Recent orders would go here */}
              <Link href="/admin/orders" className="btn-outline text-sm">
                View All Orders
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-bold">Recent Products</h2>
            </div>
            <div className="p-6">
              {/* Recent products would go here */}
              <Link href="/admin/products" className="btn-outline text-sm">
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
