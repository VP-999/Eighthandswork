import { NextResponse } from "next/server"
import { UserService } from "@/backend/services/UserService"

// GET /api/users - Get all users (admin only)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // TODO: Add authentication middleware to verify admin

    const filters = {
      search: searchParams.get("search") || undefined,
      is_admin: searchParams.get("is_admin") ? searchParams.get("is_admin") === "true" : undefined,
    }

    const result = await UserService.getAllUsers(filters)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length,
    })
  } catch (error) {
    console.error("GET /api/users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/users - Create user profile
export async function POST(request) {
  try {
    const body = await request.json()

    const result = await UserService.createUserProfile(body)

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
    console.error("POST /api/users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
