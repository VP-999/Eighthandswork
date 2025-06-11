import { NextResponse } from "next/server"
import { OrderService } from "@/backend/services/OrderService"
import { ProductModel } from "@/backend/models/Product"
import { UserModel } from "@/backend/models/User"
import { ContactMessageModel } from "@/backend/models/ContactMessage"
import { CategoryModel } from "@/backend/models/Category"

// GET /api/stats - Get dashboard statistics (admin only)
export async function GET() {
  try {
    // TODO: Add authentication middleware to verify admin

    // Get order statistics
    const orderStats = await OrderService.getOrderStatistics()

    // Get product count
    const productResult = await ProductModel.findAll()
    const productCount = productResult.success ? productResult.data.length : 0

    // Get user count
    const userResult = await UserModel.findAll()
    const userCount = userResult.success ? userResult.data.length : 0

    // Get category count
    const categoryResult = await CategoryModel.findAll()
    const categoryCount = categoryResult.success ? categoryResult.data.length : 0

    // Get unread messages count
    const unreadResult = await ContactMessageModel.getUnreadCount()
    const unreadMessages = unreadResult.success ? unreadResult.count : 0

    const stats = {
      orders: orderStats.success
        ? orderStats.data
        : {
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            totalRevenue: 0,
          },
      products: productCount,
      users: userCount,
      categories: categoryCount,
      unreadMessages: unreadMessages,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("GET /api/stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
