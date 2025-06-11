import { NextResponse } from "next/server"
import { ProductService } from "@/backend/services/ProductService"

// GET /api/products - Get all products with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")) : undefined,
      offset: searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")) : undefined,
      in_stock: searchParams.get("in_stock") ? searchParams.get("in_stock") === "true" : undefined,
    }

    const result = await ProductService.getAllProducts(filters)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length,
    })
  } catch (error) {
    console.error("GET /api/products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/products - Create new product (admin only)
export async function POST(request) {
  try {
    const body = await request.json();

    // Process image URL if exists
    if (body.image_url) {
      body.image_url = body.image_url.trim();
      if (!body.image_url.match(/^https?:\/\//)) {
        body.image_url = `https://${body.image_url}`;
      }
    }

    const result = await ProductService.createProduct(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
