import { NextResponse } from "next/server"
import { ProductService } from "@/backend/services/ProductService"

// GET /api/products/search - Search products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get("q") || ""
    const filters = {
      category: searchParams.get("category") || undefined,
      in_stock: searchParams.get("in_stock") ? searchParams.get("in_stock") === "true" : undefined,
    }

    const result = await ProductService.searchProducts(query, filters)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length,
      query: query,
    })
  } catch (error) {
    console.error("GET /api/products/search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
