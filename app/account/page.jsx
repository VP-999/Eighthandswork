"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { User, Package, LogOut } from "lucide-react"

export default function Account() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { supabase, user } = useSupabase()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        if (!loading) {
          router.push("/login?redirect=/account")
        }
        return
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, email, phone, address")
          .eq("id", user.id)
          .single()

        if (error) throw error

        setUserData(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase, user, loading, router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
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
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-amber-500 text-white">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8" />
                  <div>
                    <p className="font-bold">{userData?.full_name || "User"}</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/account"
                      className="flex items-center space-x-2 p-2 rounded-md bg-amber-50 text-amber-700"
                    >
                      <User className="h-5 w-5" />
                      <span>Account Details</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/orders" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
                      <Package className="h-5 w-5" />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 w-full text-left text-red-600"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Account Details</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                    <p className="text-lg">{userData?.full_name || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                    <p className="text-lg">{userData?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                    <p className="text-lg">{userData?.address || "Not provided"}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/account/edit" className="btn-primary">
                    Edit Account Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Recent Orders</h2>
              </div>
              <div className="p-6">
                <Link href="/orders" className="btn-outline">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
