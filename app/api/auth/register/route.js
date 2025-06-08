import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/backend/config/database"
import { UserService } from "@/backend/services/UserService"

// POST /api/auth/register - Register new user
export async function POST(request) {
  try {
    const body = await request.json()

    const { email, password, full_name, phone, address } = body

    // Validate required fields
    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create user profile
    const profileResult = await UserService.createUserProfile({
      id: authData.user.id,
      email: authData.user.email,
      full_name,
      phone: phone || "",
      address: address || "",
      is_admin: email === "admin@example.com",
    })

    if (!profileResult.success) {
      // Rollback auth user creation
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: profileResult.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: authData.user,
          profile: profileResult.data,
        },
        message: "User registered successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/auth/register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
