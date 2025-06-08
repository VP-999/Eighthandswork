import { UserModel } from "../models/User.js"
import { supabaseAdmin } from "../config/database.js"

export class UserService {
  // Get user profile
  static async getUserProfile(userId) {
    try {
      const result = await UserModel.findById(userId)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("UserService - getUserProfile error:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Create user profile
  static async createUserProfile(userData) {
    try {
      // Validate required fields
      if (!userData.id || !userData.email) {
        throw new Error("User ID and email are required")
      }

      const result = await UserModel.create(userData)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error("UserService - createUserProfile error:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Update user profile
  static async updateUserProfile(userId, userData) {
    try {
      // Validate user exists
      const existingUser = await UserModel.findById(userId)
      if (!existingUser.success) {
        throw new Error("User not found")
      }

      const result = await UserModel.update(userId, userData)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error("UserService - updateUserProfile error:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Get all users (admin only)
  static async getAllUsers(filters = {}) {
    try {
      const result = await UserModel.findAll(filters)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("UserService - getAllUsers error:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      // Check if user exists
      const existingUser = await UserModel.findById(userId)
      if (!existingUser.success) {
        throw new Error("User not found")
      }

      // Delete from auth
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (authError) {
        throw new Error(`Failed to delete user from auth: ${authError.message}`)
      }

      // Delete from users table (should cascade due to foreign key)
      const result = await UserModel.delete(userId)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error("UserService - deleteUser error:", error)
      return { success: false, error: error.message }
    }
  }

  // Check admin status
  static async checkAdminStatus(userId) {
    try {
      const result = await UserModel.isAdmin(userId)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("UserService - checkAdminStatus error:", error)
      return { success: false, isAdmin: false, error: error.message }
    }
  }

  // Create admin user
  static async createAdminUser(email = "admin@example.com", password = "Admin123!") {
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: "Admin User",
        },
      })

      if (authError) {
        throw new Error(`Failed to create admin user in auth: ${authError.message}`)
      }

      // Create user profile
      const profileResult = await UserModel.create({
        id: authData.user.id,
        email: authData.user.email,
        full_name: "Admin User",
        is_admin: true,
      })

      if (!profileResult.success) {
        throw new Error(profileResult.error)
      }

      return { success: true, data: profileResult.data, error: null }
    } catch (error) {
      console.error("UserService - createAdminUser error:", error)
      return { success: false, data: null, error: error.message }
    }
  }
}
