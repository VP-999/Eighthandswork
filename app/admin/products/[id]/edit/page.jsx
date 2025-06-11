"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useSupabase } from "@/lib/supabase-provider"
import { ArrowLeft, Save, Trash2, ImagePlus } from "lucide-react"

export default function EditProduct({ params }) {
  // Fix: use params directly without React.use()
  const productId = params.id
  
  const router = useRouter()
  const { supabase, user } = useSupabase()
  
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    category: "",
    image_url: "",
    in_stock: true,
    is_new: false,
    is_featured: false,
    is_bestseller: false
  })
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Define category groups for the selector
  const categoryGroups = {
    "Living Room": ["Sofa", "Coffee Table", "Armchair", "TV Stand", "Bookshelf"],
    "Dining Room": ["Dining Table", "Dining Chair", "Buffet", "China Cabinet"],
    "Bedroom": ["Bed", "Dresser", "Nightstand", "Wardrobe", "Chest of Drawers"],
    "Office": ["Office Desk", "Office Chair", "Filing Cabinet", "Bookcase"],
    "Outdoor": ["Patio Set", "Garden Bench", "Outdoor Chair", "Hammock"]
  }

  // Check admin status and fetch product data
  useEffect(() => {
    const checkAdminAndFetchProduct = async () => {
      if (!user) {
        router.push("/login?redirect=/admin/products")
        return
      }

      try {
        // Check if user is admin
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", user.id)
          .single()

        if (userError) throw userError
        if (!userData?.is_admin) {
          router.push("/")
          return
        }

        // First try to get data directly from Supabase
        setLoading(true)
        
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single()
          
        if (productError) throw productError
        
        if (!productData) {
          setError("Product not found")
          return
        }
        
        // Set product data
        setProduct({
          ...productData,
          price: productData.price !== null ? productData.price : "",
          discount_price: productData.discount_price !== null ? productData.discount_price : "",
        })

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("name")
          .order("name")

        if (categoriesError) throw categoriesError
        setCategories(categoriesData?.map(cat => cat.name) || [])

      } catch (error) {
        console.error("Error:", error)
        setError("Failed to fetch product data: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    checkAdminAndFetchProduct()
  }, [supabase, user, productId, router])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleNumberInput = (e) => {
    const { name, value } = e.target
    // Allow only numbers and decimal point
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setProduct(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  // Helper function to check if a category exists in our groupings
  const categoryExists = (categoryName) => {
    return categories.includes(categoryName)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      let imageUrl = product.image_url

      // Upload image if a new one is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
      }

      // Prepare data for API
      const productData = {
        ...product,
        image_url: imageUrl,
        // Ensure numbers are properly formatted
        price: parseFloat(product.price),
        discount_price: product.discount_price ? parseFloat(product.discount_price) : null
      }

      console.log("Sending update for product:", productId)
      console.log("Update data:", productData)

      // Update product via API with cache-busting parameter
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/products/${productId}?t=${timestamp}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store',
        body: JSON.stringify(productData)
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to update product")
      }

      // If successful, update the local product state
      if (result.data) {
        setProduct({
          ...result.data,
          price: result.data.price.toString(),
          discount_price: result.data.discount_price ? result.data.discount_price.toString() : ""
        })
      }

      setSuccess(true)
      // Scroll to top to show success message
      window.scrollTo(0, 0)

    } catch (error) {
      console.error("Error updating product:", error)
      setError("Failed to update product: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    try {
      // Delete product via API
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to delete product")
      }

      router.push("/admin/products?deleted=true")
    } catch (error) {
      console.error("Error deleting product:", error)
      setError("Failed to delete product: " + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/products" className="flex items-center text-gray-600 hover:text-amber-500">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold">Edit Product</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Product updated successfully!</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-amber-200 focus:border-amber-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={product.category || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-amber-200 focus:border-amber-500"
                  required
                >
                  <option value="">Select Category</option>
                  {Object.entries(categoryGroups).map(([groupName, groupCategories]) => {
                    // Only show groups that have at least one category in our database
                    const existingCategories = groupCategories.filter(categoryExists)
                    if (existingCategories.length === 0) return null

                    return (
                      <optgroup key={groupName} label={groupName}>
                        {existingCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </optgroup>
                    )
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={product.price}
                    onChange={handleNumberInput}
                    className="w-full p-2 border rounded focus:ring focus:ring-amber-200 focus:border-amber-500"
                    required
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Discount Price ($)
                  </label>
                  <input
                    type="text"
                    name="discount_price"
                    value={product.discount_price}
                    onChange={handleNumberInput}
                    className="w-full p-2 border rounded focus:ring focus:ring-amber-200 focus:border-amber-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-amber-200 focus:border-amber-500"
                  rows={5}
                ></textarea>
              </div>
            </div>

            {/* Right column */}
            <div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Product Image
                </label>
                <div className="border rounded-md p-4">
                  <div className="mb-4 relative h-48 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                    {(imagePreview || product.image_url) ? (
                      <Image
                        src={imagePreview || product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <ImagePlus size={40} />
                        <p className="mt-2 text-sm">No image</p>
                      </div>
                    )}
                  </div>
                  <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <ImagePlus size={16} className="mr-2" />
                    {product.image_url ? "Change Image" : "Upload Image"}
                  </label>
                </div>
              </div>

              <div className="mb-4 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in_stock"
                    name="in_stock"
                    checked={product.in_stock}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="in_stock" className="ml-2 text-sm text-gray-700">
                    In Stock
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_new"
                    name="is_new"
                    checked={product.is_new}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="is_new" className="ml-2 text-sm text-gray-700">
                    New Product
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={product.is_featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                    Featured Product
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_bestseller"
                    name="is_bestseller"
                    checked={product.is_bestseller}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="is_bestseller" className="ml-2 text-sm text-gray-700">
                    Bestseller
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <button
              type="button"
              onClick={handleDeleteProduct}
              className="inline-flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Product
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
