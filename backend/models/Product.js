import { supabaseAdmin } from "../config/database.js"

export class ProductModel {
  static tableName = "products"

  // Get all products with filters
  static async findAll(filters = {}) {
    try {
      let query = supabaseAdmin.from(this.tableName).select("*")

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category)
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.in_stock !== undefined) {
        query = query.eq("in_stock", filters.in_stock)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error finding products:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get product by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin.from(this.tableName).select("*").eq("id", id).single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error finding product by ID:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Create new product
  // Create new product
  static async create(productData) {
    try {
      // Ensure image_url is properly processed
      const imageUrl = productData.image_url || null;

      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .insert([
          {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image_url: imageUrl,
            category: productData.category,
            in_stock: productData.in_stock !== undefined ? productData.in_stock : true,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false, data: null, error: error.message };
    }
  }

  // Update product
  static async update(id, productData) {
    try {
      const updateData = {
        updated_at: new Date().toISOString(),
      }

      if (productData.name !== undefined) updateData.name = productData.name
      if (productData.description !== undefined) updateData.description = productData.description
      if (productData.price !== undefined) updateData.price = productData.price
      if (productData.image_url !== undefined) updateData.image_url = productData.image_url
      if (productData.category !== undefined) updateData.category = productData.category
      if (productData.in_stock !== undefined) updateData.in_stock = productData.in_stock

      const { data, error } = await supabaseAdmin.from(this.tableName).update(updateData).eq("id", id).select().single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error updating product:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Delete product
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin.from(this.tableName).delete().eq("id", id)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error("Error deleting product:", error)
      return { success: false, error: error.message }
    }
  }

  // Get products by category
  static async findByCategory(category) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select("*")
        .eq("category", category)
        .eq("in_stock", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error finding products by category:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get featured products
  static async getFeatured(limit = 12) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select("*")
        .eq("in_stock", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error getting featured products:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Search products
  static async search(query, filters = {}) {
    try {
      let dbQuery = supabaseAdmin
        .from(this.tableName)
        .select("*")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

      if (filters.category && filters.category !== "all") {
        dbQuery = dbQuery.eq("category", filters.category)
      }

      if (filters.in_stock !== undefined) {
        dbQuery = dbQuery.eq("in_stock", filters.in_stock)
      }

      const { data, error } = await dbQuery.order("created_at", { ascending: false })

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error searching products:", error)
      return { success: false, data: [], error: error.message }
    }
  }
}
