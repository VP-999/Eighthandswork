import { supabaseAdmin } from "../config/database.js"

export class ContactMessageModel {
  static tableName = "contact_messages"

  // Get all contact messages
  static async findAll(filters = {}) {
    try {
      let query = supabaseAdmin.from(this.tableName).select("*")

      if (filters.is_read !== undefined) {
        query = query.eq("is_read", filters.is_read)
      }

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,message.ilike.%${filters.search}%`,
        )
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error finding contact messages:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get contact message by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin.from(this.tableName).select("*").eq("id", id).single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error finding contact message by ID:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Create new contact message
  static async create(messageData) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .insert([
          {
            name: messageData.name,
            email: messageData.email,
            message: messageData.message,
            is_read: false,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error creating contact message:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Mark message as read/unread
  static async markAsRead(id, isRead = true) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .update({ is_read: isRead })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error marking message as read:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Delete contact message
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin.from(this.tableName).delete().eq("id", id)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error("Error deleting contact message:", error)
      return { success: false, error: error.message }
    }
  }

  // Get unread message count
  static async getUnreadCount() {
    try {
      const { count, error } = await supabaseAdmin
        .from(this.tableName)
        .select("*", { count: "exact", head: true })
        .eq("is_read", false)

      if (error) throw error
      return { success: true, count: count || 0, error: null }
    } catch (error) {
      console.error("Error getting unread message count:", error)
      return { success: false, count: 0, error: error.message }
    }
  }
}
