// Frontend API client for making requests to our backend
class ApiClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "/api"
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Products API
  async getProducts(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value)
      }
    })

    const endpoint = `/products${params.toString() ? `?${params.toString()}` : ""}`
    return this.request(endpoint)
  }

  async getProduct(id) {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData) {
    return this.request("/products", {
      method: "POST",
      body: productData,
    })
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: productData,
    })
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    })
  }

  async getFeaturedProducts(limit = 12) {
    return this.request(`/products/featured?limit=${limit}`)
  }

  async searchProducts(query, filters = {}) {
    const params = new URLSearchParams({ q: query })
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value)
      }
    })

    return this.request(`/products/search?${params.toString()}`)
  }

  // Categories API
  async getCategories() {
    return this.request("/categories")
  }

  async createCategory(categoryData) {
    return this.request("/categories", {
      method: "POST",
      body: categoryData,
    })
  }

  // Orders API
  async getOrders(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value)
      }
    })

    const endpoint = `/orders${params.toString() ? `?${params.toString()}` : ""}`
    return this.request(endpoint)
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`)
  }

  async createOrder(orderData, orderItems) {
    return this.request("/orders", {
      method: "POST",
      body: { orderData, orderItems },
    })
  }

  async updateOrder(id, orderData) {
    return this.request(`/orders/${id}`, {
      method: "PUT",
      body: orderData,
    })
  }

  async deleteOrder(id) {
    return this.request(`/orders/${id}`, {
      method: "DELETE",
    })
  }

  // Users API
  async getUsers(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value)
      }
    })

    const endpoint = `/users${params.toString() ? `?${params.toString()}` : ""}`
    return this.request(endpoint)
  }

  async getUser(id) {
    return this.request(`/users/${id}`)
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: userData,
    })
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    })
  }

  // Contact API
  async getContactMessages(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value)
      }
    })

    const endpoint = `/contact${params.toString() ? `?${params.toString()}` : ""}`
    return this.request(endpoint)
  }

  async createContactMessage(messageData) {
    return this.request("/contact", {
      method: "POST",
      body: messageData,
    })
  }

  async markMessageAsRead(id, isRead) {
    return this.request(`/contact/${id}`, {
      method: "PUT",
      body: { is_read: isRead },
    })
  }

  async deleteContactMessage(id) {
    return this.request(`/contact/${id}`, {
      method: "DELETE",
    })
  }

  // Auth API
  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: userData,
    })
  }

  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: credentials,
    })
  }

  async createAdminUser() {
    return this.request("/auth/admin", {
      method: "POST",
    })
  }

  // Stats API
  async getStats() {
    return this.request("/stats")
  }
}

export const apiClient = new ApiClient()
export default apiClient
