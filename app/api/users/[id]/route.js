import { NextResponse } from "next/server"
import { UserService } from "@/backend/services/UserService"

// GET /api/users/[id] - Get user profile
export async function GET(request, { params }) {
  try {
    const { id } = params

    // TODO: Add authentication middleware to verify user owns profile

    const result = await UserService.getUserProfile(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error === "User not found" ? 404 : 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("GET /api/users/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    // TODO: Add authentication middleware to verify user owns profile

    const result = await UserService.updateUserProfile(id, body)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error === "User not found" ? 404 : 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // TODO: Add authentication middleware to verify admin

    const result = await UserService.deleteUser(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error === "User not found" ? 404 : 400 })
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
