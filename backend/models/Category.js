import { supabaseAdmin } from "../config/database.js"

export class CategoryModel {
  static tableName = "categories"

  // Get all categories
  static async findAll() {
    try {
      const { data, error } = await supabaseAdmin.from(this.tableName).select("*").order("name")

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error finding categories:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get category by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin.from(this.tableName).select("*").eq("id", id).single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error finding category by ID:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Get category by name
  static async findByName(name) {
    try {
      const { data, error } = await supabaseAdmin.from(this.tableName).select("*").eq("name", name).single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error finding category by name:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Create new category
  static async create(categoryData) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .insert([
          {
            name: categoryData.name,
            description: categoryData.description || "",
          },
        ])
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error creating category:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Update category
  static async update(id, categoryData) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .update({
          name: categoryData.name,
          description: categoryData.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, error: null }
    } catch (error) {
      console.error("Error updating category:", error)
      return { success: false, data: null, error: error.message }
    }
  }

  // Delete category
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin.from(this.tableName).delete().eq("id", id)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error("Error deleting category:", error)
      return { success: false, error: error.message }
    }
  }

  // Get categories with product count
  static async findAllWithProductCount() {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select(`
          *,
          products:products(count)
        `)
        .order("name")

      if (error) throw error
      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error("Error finding categories with product count:", error)
      return { success: false, data: [], error: error.message }
    }
  }
}
