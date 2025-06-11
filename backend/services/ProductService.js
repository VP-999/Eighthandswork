import { ProductModel } from "../models/Product.js"
import { CategoryModel } from "../models/Category.js"

export class ProductService {
  // Get all products with filters
  static async getAllProducts(filters = {}) {
    try {
      const result = await ProductModel.findAll(filters)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("ProductService - getAllProducts error:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      console.log(`Getting product with ID: ${id}`)
      const data = await ProductModel.findById(id)
      
      if (!data) {
        return { success: false, error: "Product not found", data: null }
      }
      
      return { success: true, data, error: null }
    } catch (error) {
      console.error(`ProductService - getProductById error:`, error)
      return { success: false, error: error.message, data: null }
    }
  }

  // Inside the createProduct method
  static async createProduct(productData) {
    try {
      // Validate required fields
      if (!productData.name || !productData.price) {
        throw new Error("Product name and price are required");
      }

      // Validate price
      const price = Number.parseFloat(productData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error("Price must be a positive number");
      }

      // Validate category exists if provided
      if (productData.category) {
        const categoryResult = await CategoryModel.findByName(productData.category);
        if (!categoryResult.success) {
          throw new Error("Invalid category");
        }
      }

      // Process image URL
      if (productData.image_url) {
        // Ensure image URL is trimmed
        productData.image_url = productData.image_url.trim();

        // Add https:// prefix if missing
        if (!productData.image_url.match(/^https?:\/\//)) {
          productData.image_url = `https://${productData.image_url}`;
        }
      }

      const result = await ProductModel.create({
        ...productData,
        price: price,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("ProductService - createProduct error:", error);
      return { success: false, data: null, error: error.message };
    }
  }

  
  // Update product
  static async updateProduct(id, productData) {
    try {
      console.log(`Updating product ${id} with data:`, productData)
      
      // Prepare the data for update
      const updateData = {
        ...productData,
        updated_at: new Date().toISOString()
      }
      
      // Make sure numerical values are properly converted
      if (updateData.price !== undefined) {
        updateData.price = parseFloat(updateData.price)
      }
      
      if (updateData.discount_price) {
        updateData.discount_price = parseFloat(updateData.discount_price)
      } else if (updateData.discount_price === "") {
        updateData.discount_price = null
      }
      
      // Execute the update
      const result = await ProductModel.update(id, updateData)
      
      console.log("Update result:", result)
      
      if (!result) {
        return { success: false, error: "Failed to update product" }
      }
      
      return { success: true, data: result }
    } catch (error) {
      console.error("ProductService.updateProduct error:", error)
      return { success: false, error: error.message }
    }
  }

  // Delete product
  static async deleteProduct(id) {
    try {
      if (!id) {
        throw new Error("Product ID is required")
      }

      // Check if product exists
      const existingProduct = await ProductModel.findById(id)
      if (!existingProduct.success) {
        throw new Error("Product not found")
      }

      const result = await ProductModel.delete(id)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error("ProductService - deleteProduct error:", error)
      return { success: false, error: error.message }
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit = 12) {
    try {
      const result = await ProductModel.getFeatured(limit)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("ProductService - getFeaturedProducts error:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Search products
  static async searchProducts(query, filters = {}) {
    try {
      if (!query || query.trim().length === 0) {
        return await this.getAllProducts(filters)
      }

      const result = await ProductModel.search(query.trim(), filters)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("ProductService - searchProducts error:", error)
      return { success: false, data: [], error: error.message }
    }
  }

  // Get products by category
  static async getProductsByCategory(category) {
    try {
      if (!category) {
        throw new Error("Category is required")
      }

      const result = await ProductModel.findByCategory(category)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error("ProductService - getProductsByCategory error:", error)
      return { success: false, data: [], error: error.message }
    }
  }
}
