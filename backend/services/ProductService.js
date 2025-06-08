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
      if (!id) {
        throw new Error("Product ID is required")
      }

      const result = await ProductModel.findById(id)
      if (!result.success) {
        throw new Error(result.error)
      }

      if (!result.data) {
        throw new Error("Product not found")
      }

      return result
    } catch (error) {
      console.error("ProductService - getProductById error:", error)
      return { success: false, data: null, error: error.message }
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
      if (!id) {
        throw new Error("Product ID is required")
      }

      // Check if product exists
      const existingProduct = await ProductModel.findById(id)
      if (!existingProduct.success) {
        throw new Error("Product not found")
      }

      // Validate price if provided
      if (productData.price !== undefined) {
        const price = Number.parseFloat(productData.price)
        if (isNaN(price) || price <= 0) {
          throw new Error("Price must be a positive number")
        }
        productData.price = price
      }

      // Validate category if provided
      if (productData.category) {
        const categoryResult = await CategoryModel.findByName(productData.category)
        if (!categoryResult.success) {
          throw new Error("Invalid category")
        }
      }

      const result = await ProductModel.update(id, productData)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error("ProductService - updateProduct error:", error)
      return { success: false, data: null, error: error.message }
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
