import { NextResponse } from "next/server"
import { ProductService } from "@/backend/services/ProductService"

// GET /api/products/[id] - Get product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    const result = await ProductService.getProductById(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error === "Product not found" ? 404 : 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("GET /api/products/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    // TODO: Add authentication middleware to verify admin

    const result = await ProductService.updateProduct(id, body)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error === "Product not found" ? 404 : 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // TODO: Add authentication middleware to verify admin

    const result = await ProductService.deleteProduct(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error === "Product not found" ? 404 : 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
