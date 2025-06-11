import { NextResponse } from "next/server"
import { UserService } from "@/backend/services/UserService"

// POST /api/auth/admin - Create admin user
export async function POST() {
  try {
    const result = await UserService.createAdminUser()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Admin user created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/auth/admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
