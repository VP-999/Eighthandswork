import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/backend/config/database"

// POST /api/auth/login - User login
export async function POST(request) {
  try {
    const body = await request.json()

    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Sign in user
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
      message: "Login successful",
    })
  } catch (error) {
    console.error("POST /api/auth/login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
