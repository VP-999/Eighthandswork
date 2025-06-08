"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { supabase, user, loading: userLoading } = useSupabase()

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        if (!userLoading) {
          router.push("/login?redirect=/admin/categories")
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
    const fetchCategories = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase.from("categories").select("*").order("name")

        if (error) throw error

        setCategories(data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCategories()
    }
  }, [supabase, user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { data, error } = await supabase.from("categories").insert([newCategory]).select()

      if (error) throw error

      setCategories([...categories, data[0]])
      setNewCategory({ name: "", description: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Error adding category:", error)
      setError(error.message || "Failed to add category. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) throw error

      setCategories(categories.filter((category) => category.id !== id))
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category. Please try again.")
    }
  }

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
        <Link href="/admin" className="inline-flex items-center text-amber-500 hover:text-amber-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <div className="mt-4 md:mt-0">
            <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              {isAdding ? "Cancel" : "Add New Category"}
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Category</h2>

              {error && <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">{error}</div>}

              <form onSubmit={handleAddCategory}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newCategory.name}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newCategory.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="input-field"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? "Adding..." : "Add Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      No categories found. Add your first category to get started.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{category.description || "No description"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/categories/edit/${category.id}`}
                            className="text-amber-500 hover:text-amber-600"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
