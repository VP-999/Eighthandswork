import { NextResponse } from "next/server"
import { CategoryModel } from "@/backend/models/Category"

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const result = await CategoryModel.findAll()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length,
    })
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/categories - Create new category (admin only)
export async function POST(request) {
  try {
    const body = await request.json()

    // TODO: Add authentication middleware to verify admin

    const result = await CategoryModel.create(body)

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
    console.error("POST /api/categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
