import { supabaseAdmin } from "../config/database.js"

export class OrderModel {
  static tableName = "orders"

  // Get all orders with filters
  static async findAll(filters = {}) {
    try {
      let query = supabaseAdmin.from(this.tableName).select(`
          *,
          users:user_id (
            id,
            email,
            full_name,
            phone
          ),
          order_items (
            id,
            quantity,
            price,
            products (
              id,
              name,
              image_url
            )
          )
        `)

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status)
      }

      if (filters.user_id) {
        query = query.eq("user_id", filters.user_id)
      }

      if (filters.search) {
        query = query.or(`id.ilike.%${filters.search}%`)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error finding orders:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get order by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select(`
          *,
          users:user_id (
            id,
            email,
            full_name,
            phone,
            address
          ),
          order_items (
            id,
            quantity,
            price,
            products (
              id,
              name,
              description,
              image_url
            )
          )
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error finding order by ID:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Create new order
  static async create(orderData) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .insert([
          {
            user_id: orderData.user_id,
            total_amount: orderData.total_amount,
            shipping_address: orderData.shipping_address,
            phone: orderData.phone,
            status: orderData.status || "pending",
          },
        ])
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error creating order:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Update order
  static async update(id, orderData) {
    try {
      const updateData = {
        updated_at: new Date().toISOString(),
      }

      if (orderData.status !== undefined) updateData.status = orderData.status
      if (orderData.shipping_address !== undefined) updateData.shipping_address = orderData.shipping_address
      if (orderData.phone !== undefined) updateData.phone = orderData.phone
      if (orderData.total_amount !== undefined) updateData.total_amount = orderData.total_amount

      const { data, error } = await supabaseAdmin.from(this.tableName).update(updateData).eq("id", id).select().single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error updating order:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Delete order
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin.from(this.tableName).delete().eq("id", id)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error("Error deleting order:", error)
      return { success: false, error: error.message }
    }
  }

  // Get user orders
  static async findByUserId(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              id,
              name,
              image_url
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error finding orders by user ID:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get order statistics
  static async getStatistics() {
    try {
      const { data: totalOrders, error: totalError } = await supabaseAdmin
        .from(this.tableName)
        .select("*", { count: "exact", head: true })

      if (totalError) throw totalError

      const { data: pendingOrders, error: pendingError } = await supabaseAdmin
        .from(this.tableName)
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      if (pendingError) throw pendingError

      const { data: completedOrders, error: completedError } = await supabaseAdmin
        .from(this.tableName)
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")

      if (completedError) throw completedError

      const { data: revenueData, error: revenueError } = await supabaseAdmin
        .from(this.tableName)
        .select("total_amount")
        .eq("status", "completed")

      if (revenueError) throw revenueError

      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number.parseFloat(order.total_amount), 0) || 0

      return {
        success: true,
        data: {
          totalOrders: totalOrders || 0,
          pendingOrders: pendingOrders || 0,
          completedOrders: completedOrders || 0,
          totalRevenue: totalRevenue,
        },
        error: null,
      }
    } catch (error) {
      console.error("Error getting order statistics:", error)
      return { success: false, data: null, error: error.message }
    }
  }
}
