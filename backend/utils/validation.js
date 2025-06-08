// Email validation
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export function isValidPassword(password) {
  return password && password.length >= 6
}

// Phone validation (basic)
export function isValidPhone(phone) {
  if (!phone) return true // Phone is optional
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

// Price validation
export function isValidPrice(price) {
  const numPrice = Number.parseFloat(price)
  return !isNaN(numPrice) && numPrice > 0
}

// UUID validation
export function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Sanitize string input
export function sanitizeString(str) {
  if (typeof str !== "string") return ""
  return str.trim().replace(/[<>]/g, "")
}

// Validate order status
export function isValidOrderStatus(status) {
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
  return validStatuses.includes(status)
}

// Validate pagination parameters
export function validatePagination(limit, offset) {
  const validLimit = Math.min(Math.max(Number.parseInt(limit) || 10, 1), 100)
  const validOffset = Math.max(Number.parseInt(offset) || 0, 0)
  return { limit: validLimit, offset: validOffset }
}
