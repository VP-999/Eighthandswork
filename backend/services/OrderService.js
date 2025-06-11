import { OrderModel } from "../models/Order.js"
import { OrderItemModel } from "../models/OrderItem.js"
import { ProductModel } from "../models/Product.js"
import { UserModel } from "../models/User.js"

export class OrderService {
  // Create new order with items
  static async createOrder(orderData, orderItems) {
    try {
      // Validate required fields
      if (!orderData.user_id || !orderData.total_amount || !orderItems || orderItems.length === 0) {
        throw new Error("User ID, total amount, and order items are required")
      }

      // Validate user exists
      const userResult = await UserModel.findById(orderData.user_id)
      if (!userResult.success) {
        throw new Error("User not found")
      }

      // Validate products exist and calculate total
      let calculatedTotal = 0
      const validatedItems = []

      for (const item of orderItems) {
        const productResult = await ProductModel.findById(item.product_id)
        if (!productResult.success) {
          throw new Error(`Product not found: ${item.product_id}`)
        }

        const product = productResult.data
        if (!product.in_stock) {
          throw new Error(`Product out of stock: ${product.name}`)
        }

        const itemTotal = Number.parseFloat(product.price) * Number.parseInt(item.quantity)
        calculatedTotal += itemTotal

        validatedItems.push({
          product_id: item.product_id,
          quantity: Number.parseInt(item.quantity),
          price: Number.parseFloat(product.price),
        })
      }

      // Verify total amount matches
      const providedTotal = Number.parseFloat(orderData.total_amount)
      if (Math.abs(calculatedTotal - providedTotal) > 0.01) {
        throw new Error("Total amount mismatch")
      }

      // Create order
      const orderResult = await OrderModel.create(orderData)
      if (!orderResult.success) {
        throw new Error(orderResult.error)
      }

      // Create order items
      const orderItemsData = validatedItems.map((item) => ({
        ...item,
        order_id: orderResult.data.id,
      }))

      const itemsResult = await OrderItemModel.createMany(orderItemsData)
      if (!itemsResult.success) {
        // Rollback order creation
        await OrderModel.delete(orderResult.data.id)
        throw new Error(itemsResult.error)
      }

      // Return complete order with items
      const completeOrder = await OrderModel.findById(orderResult.data.id)
      return completeOrder
    } catch (error) {
      console.error("OrderService - createOrder error:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Get all orders with filters
  static async getAllOrders(filters = {}) {
    try {
      const result = await OrderModel.findAll(filters)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("OrderService - getAllOrders error:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get order by ID
  static async getOrderById(id) {
    try {
      if (!id) {
        throw new Error("Order ID is required")
      }

      const result = await OrderModel.findById(id)
      if (!result.success) {
        throw new Error(result.error)
      }

      if (!result.data) {
        throw new Error("Order not found")
      }

      return result
    } catch (error) {
      console.error("OrderService - getOrderById error:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Get user orders
  static async getUserOrders(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required")
      }

      const result = await OrderModel.findByUserId(userId)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("OrderService - getUserOrders error:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Update order status
  static async updateOrderStatus(id, status) {
    try {
      if (!id || !status) {
        throw new Error("Order ID and status are required")
      }

      const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid order status")
      }

      // Check if order exists
      const existingOrder = await OrderModel.findById(id)
      if (!existingOrder.success) {
        throw new Error("Order not found")
      }

      const result = await OrderModel.update(id, { status })
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error("OrderService - updateOrderStatus error:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Update order
  static async updateOrder(id, orderData) {
    try {
      if (!id) {
        throw new Error("Order ID is required")
      }

      // Check if order exists
      const existingOrder = await OrderModel.findById(id)
      if (!existingOrder.success) {
        throw new Error("Order not found")
      }

      const result = await OrderModel.update(id, orderData)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error("OrderService - updateOrder error:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Delete order
  static async deleteOrder(id) {
    try {
      if (!id) {
        throw new Error("Order ID is required")
      }

      // Check if order exists
      const existingOrder = await OrderModel.findById(id)
      if (!existingOrder.success) {
        throw new Error("Order not found")
      }

      // Delete order items first
      await OrderItemModel.deleteByOrderId(id)

      // Delete order
      const result = await OrderModel.delete(id)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error("OrderService - deleteOrder error:", error)
      return { success: false, error: error.message }
    }
  }

  // Get order statistics
  static async getOrderStatistics() {
    try {
      const result = await OrderModel.getStatistics()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("OrderService - getOrderStatistics error:", error)
      return { success: false, data: null, error: error.message }
    }
  }
}
