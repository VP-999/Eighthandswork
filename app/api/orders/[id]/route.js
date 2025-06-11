import { NextResponse } from "next/server"
import { OrderService } from "@/backend/services/OrderService"

// GET /api/orders/[id] - Get order by ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    const result = await OrderService.getOrderById(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error === "Order not found" ? 404 : 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/orders/[id] - Update order
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    // TODO: Add authentication middleware

    const result = await OrderService.updateOrder(id, body)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error === "Order not found" ? 404 : 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("PUT /api/orders/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/orders/[id] - Delete order (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // TODO: Add authentication middleware to verify admin

    const result = await OrderService.deleteOrder(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error === "Order not found" ? 404 : 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
