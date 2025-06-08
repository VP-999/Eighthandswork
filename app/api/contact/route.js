import { NextResponse } from "next/server"
import { ContactMessageModel } from "@/backend/models/ContactMessage"

// GET /api/contact - Get all contact messages (admin only)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // TODO: Add authentication middleware to verify admin

    const filters = {
      is_read: searchParams.get("is_read") ? searchParams.get("is_read") === "true" : undefined,
      search: searchParams.get("search") || undefined,
    }

    const result = await ContactMessageModel.findAll(filters)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.data.length,
    })
  } catch (error) {
    console.error("GET /api/contact error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/contact - Create new contact message
export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const result = await ContactMessageModel.create(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Message sent successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/contact error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
