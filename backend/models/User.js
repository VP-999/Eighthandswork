import { supabaseAdmin } from "../config/database.js"

export class UserModel {
  static tableName = "users"

  // Get user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin.from(this.tableName).select("*").eq("id", id).single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error finding user by ID:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Get user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabaseAdmin.from(this.tableName).select("*").eq("email", email).single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error finding user by email:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .insert([
          {
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name || "",
            phone: userData.phone || "",
            address: userData.address || "",
            is_admin: userData.is_admin || false,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error creating user:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Update user
  static async update(id, userData) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .update({
          full_name: userData.full_name,
          phone: userData.phone,
          address: userData.address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error updating user:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Get all users (admin only)
  static async findAll(filters = {}) {
    try {
      let query = supabaseAdmin.from(this.tableName).select("*")

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      if (filters.is_admin !== undefined) {
        query = query.eq("is_admin", filters.is_admin)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error finding all users:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin.from(this.tableName).delete().eq("id", id)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error("Error deleting user:", error)
      return { success: false, error: error.message }
    }
  }

  // Check if user is admin
  static async isAdmin(id) {
    try {
      const { data, error } = await supabaseAdmin.from(this.tableName).select("is_admin").eq("id", id).single()

      if (error) throw error
      return { success: true, isAdmin: data?.is_admin || false, error: null }
    } catch (error) {
      console.error("Error checking admin status:", error)
      return { success: false, isAdmin: false, error: error.message }
    }
  }
}
