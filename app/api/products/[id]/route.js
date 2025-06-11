import { NextResponse } from "next/server"
import { ProductService } from "@/backend/services/ProductService"

// GET /api/products/[id] - Get a single product
export async function GET(request, { params }) {
  try {
    // Get id
    const id = params.id
    
    console.log(`API: Getting product with ID: ${id}`)
    const result = await ProductService.getProductById(id)
    
    if (!result.success) {
      console.error(`Product not found with ID: ${id}`, result.error)
      return NextResponse.json({ error: result.error || "Product not found" }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
    }, {
      headers: {
        // Disable caching to ensure fresh data
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error) {
    console.error(`GET /api/products/${params.id} error:`, error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(request, { params }) {
  try {
    // Fix: Await params before accessing id
    const id = await Promise.resolve(params).then(p => p.id);
    const body = await request.json()
    
    console.log("Updating product with ID:", id)
    console.log("Update data:", body)
    
    // Process the data
    if (body.image_url) {
      body.image_url = body.image_url.trim()
      
      if (!body.image_url.match(/^https?:\/\//)) {
        body.image_url = `https://${body.image_url}`
      }
    }
    
    // Convert price and discount_price to numbers if they exist as strings
    if (body.price !== undefined) {
      body.price = parseFloat(body.price)
    }
    
    if (body.discount_price) {
      body.discount_price = parseFloat(body.discount_price)
    } else if (body.discount_price === "") {
      body.discount_price = null // Handle empty string case
    }
    
    const result = await ProductService.updateProduct(id, body)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update product" }, { status: 400 })
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
    }, {
      headers: {
        // Disable caching to ensure fresh data
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error) {
    console.error(`PUT /api/products/${params?.id} error:`, error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(request, { params }) {
  try {
    // Fix: Await params before accessing id
    const id = await Promise.resolve(params).then(p => p.id);
    
    const result = await ProductService.deleteProduct(id)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json({
      success: true,
    }, {
      headers: {
        // Disable caching to ensure fresh data
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error) {
    console.error(`DELETE /api/products/${params?.id} error:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
