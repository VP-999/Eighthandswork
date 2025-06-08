import { NextResponse } from "next/server"
import { ProductService } from "@/backend/services/ProductService"

// GET /api/products/featured - Get featured products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")) : 12

    const result = await ProductService.getFeaturedProducts(limit)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length,
    })
  } catch (error) {
    console.error("GET /api/products/featured error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
