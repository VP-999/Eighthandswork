import { supabase } from "./supabase-client"

// Products API
export const productsAPI = {
  // Get all products with optional filters
  async getAll(filters = {}) {
    try {
      let query = supabase.from("products").select("*")

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category)
      }

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      console.error("Error fetching products:", error)
      return { data: [], error: error.message }
    }
  },

  // Get single product by ID
  async getById(id) {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Error fetching product:", error)
      return { data: null, error: error.message }
    }
  },

  // Create new product
  async create(productData) {
    try {
      const { data, error } = await supabase.from("products").insert([productData]).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Error creating product:", error)
      return { data: null, error: error.message }
    }
  },

  // Update product
  async update(id, productData) {
    try {
      const { data, error } = await supabase.from("products").update(productData).eq("id", id).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Error updating product:", error)
      return { data: null, error: error.message }
    }
  },

  // Delete product
  async delete(id) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error("Error deleting product:", error)
      return { error: error.message }
    }
  },
}

// Categories API
export const categoriesAPI = {
  async getAll() {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name")

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      console.error("Error fetching categories:", error)
      return { data: [], error: error.message }
    }
  },

  async create(categoryData) {
    try {
      const { data, error } = await supabase.from("categories").insert([categoryData]).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Error creating category:", error)
      return { data: null, error: error.message }
    }
  },
}

// Users API
export const usersAPI = {
  async getProfile(userId) {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return { data: null, error: error.message }
    }
  },

  async createProfile(userData) {
    try {
      const { data, error } = await supabase.from("users").insert([userData]).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Error creating user profile:", error)
      return { data: null, error: error.message }
    }
  },

  async updateProfile(userId, userData) {
    try {
      const { data, error } = await supabase.from("users").update(userData).eq("id", userId).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return { data: null, error: error.message }
    }
  },
}

// Auth API
export const authAPI = {
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) throw error

      // Create user profile if signup successful
      if (data.user) {
        await usersAPI.createProfile({
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name || "",
          phone: userData.phone || "",
          address: userData.address || "",
          is_admin: email === "admin@example.com",
        })
      }

      return { data, error: null }
    } catch (error) {
      console.error("Error signing up:", error)
      return { data: null, error: error.message }
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Error signing in:", error)
      return { data: null, error: error.message }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error("Error signing out:", error)
      return { error: error.message }
    }
  },

  async createAdminUser() {
    try {
      const adminEmail = "admin@example.com"
      const adminPassword = "Admin123!"

      // Try to sign up admin user
      const { data, error } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            full_name: "Admin User",
          },
        },
      })

      if (error && !error.message.includes("already registered")) {
        throw error
      }

      // Ensure admin profile exists
      if (data?.user) {
        await usersAPI.createProfile({
          id: data.user.id,
          email: adminEmail,
          full_name: "Admin User",
          is_admin: true,
        })
      }

      return { data, error: null }
    } catch (error) {
      console.error("Error creating admin user:", error)
      return { data: null, error: error.message }
    }
  },
}

// Orders API
export const ordersAPI = {
  async create(orderData) {
    try {
      const { data, error } = await supabase.from("orders").insert([orderData]).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Error creating order:", error)
      return { data: null, error: error.message }
    }
  },

  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      console.error("Error fetching user orders:", error)
      return { data: [], error: error.message }
    }
  },
}
