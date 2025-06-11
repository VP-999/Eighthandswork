import { supabaseAdmin } from "../config/database.js"
import { UserModel } from "../models/User.js"

// Verify JWT token and get user
export async function verifyAuth(request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, error: "No authorization token provided" }
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

    // Verify the JWT token
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return { success: false, error: "Invalid or expired token" }
    }

    return { success: true, user }
  } catch (error) {
    console.error("Auth verification error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

// Verify user is admin
export async function verifyAdmin(request) {
  try {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return authResult
    }

    const adminResult = await UserModel.isAdmin(authResult.user.id)

    if (!adminResult.success || !adminResult.isAdmin) {
      return { success: false, error: "Admin access required" }
    }

    return { success: true, user: authResult.user }
  } catch (error) {
    console.error("Admin verification error:", error)
    return { success: false, error: "Admin verification failed" }
  }
}

// Verify user owns resource or is admin
export async function verifyOwnershipOrAdmin(request, resourceUserId) {
  try {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return authResult
    }

    const user = authResult.user

    // Check if user owns the resource
    if (user.id === resourceUserId) {
      return { success: true, user, isOwner: true, isAdmin: false }
    }

    // Check if user is admin
    const adminResult = await UserModel.isAdmin(user.id)

    if (adminResult.success && adminResult.isAdmin) {
      return { success: true, user, isOwner: false, isAdmin: true }
    }

    return { success: false, error: "Access denied" }
  } catch (error) {
    console.error("Ownership verification error:", error)
    return { success: false, error: "Access verification failed" }
  }
}
