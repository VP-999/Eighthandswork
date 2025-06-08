import { NextResponse } from "next/server"
import { ContactMessageModel } from "@/backend/models/ContactMessage"

// GET /api/contact/[id] - Get contact message by ID (admin only)
export async function GET(request, { params }) {
  try {
    const { id } = params

    // TODO: Add authentication middleware to verify admin

    const result = await ContactMessageModel.findById(id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Contact message not found" ? 404 : 400 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("GET /api/contact/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/contact/[id] - Mark message as read/unread (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    // TODO: Add authentication middleware to verify admin

    const { is_read } = body

    if (typeof is_read !== "boolean") {
      return NextResponse.json({ error: "is_read must be a boolean" }, { status: 400 })
    }

    const result = await ContactMessageModel.markAsRead(id, is_read)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Contact message not found" ? 404 : 400 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("PUT /api/contact/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/contact/[id] - Delete contact message (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // TODO: Add authentication middleware to verify admin

    const result = await ContactMessageModel.delete(id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Contact message not found" ? 404 : 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Contact message deleted successfully",
    })
  } catch (error) {
    console.error("DELETE /api/contact/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
