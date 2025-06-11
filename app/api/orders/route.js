import { NextResponse } from "next/server"
import { OrderService } from "@/backend/services/OrderService"

// GET /api/orders - Get orders with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      status: searchParams.get("status") || undefined,
      user_id: searchParams.get("user_id") || undefined,
      search: searchParams.get("search") || undefined,
    }

    const result = await OrderService.getAllOrders(filters)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length,
    })
  } catch (error) {
    console.error("GET /api/orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/orders - Create new order
export async function POST(request) {
  try {
    const body = await request.json()

    // TODO: Add authentication middleware to verify user

    const { orderData, orderItems } = body

    if (!orderData || !orderItems) {
      return NextResponse.json({ error: "Order data and order items are required" }, { status: 400 })
    }

    const result = await OrderService.createOrder(orderData, orderItems)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
