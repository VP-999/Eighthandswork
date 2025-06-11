"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"

export default function AdminRedirect() {
  const router = useRouter()
  const { user, loading } = useSupabase()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/admin")
      } else {
        router.push("/admin/dashboard")
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen pt-20 pb-16 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  )
}
