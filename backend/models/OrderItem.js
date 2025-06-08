import { supabaseAdmin } from "../config/database.js"

export class OrderItemModel {
  static tableName = "order_items"

  // Create order items
  static async createMany(orderItems) {
    try {
      const { data, error } = await supabaseAdmin.from(this.tableName).insert(orderItems).select()

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error creating order items:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get order items by order ID
  static async findByOrderId(orderId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select(`
          *,
          products (
            id,
            name,
            description,
            image_url
          )
        `)
        .eq("order_id", orderId)

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error finding order items by order ID:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Update order item
  static async update(id, itemData) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .update({
          quantity: itemData.quantity,
          price: itemData.price,
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error updating order item:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Delete order item
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin.from(this.tableName).delete().eq("id", id)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error("Error deleting order item:", error)
      return { success: false, error: error.message }
    }
  }

  // Delete all items for an order
  static async deleteByOrderId(orderId) {
    try {
      const { error } = await supabaseAdmin.from(this.tableName).delete().eq("order_id", orderId)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error("Error deleting order items by order ID:", error)
      return { success: false, error: error.message }
    }
  }
}
