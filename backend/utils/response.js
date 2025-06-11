// Standardized API response helpers
export class ApiResponse {
  static success(data, message = null, statusCode = 200) {
    return {
      success: true,
      data,
      message,
      statusCode,
    }
  }

  static error(error, statusCode = 400) {
    return {
      success: false,
      error: typeof error === "string" ? error : error.message,
      statusCode,
    }
  }

  static notFound(resource = "Resource") {
    return {
      success: false,
      error: `${resource} not found`,
      statusCode: 404,
    }
  }

  static unauthorized(message = "Unauthorized") {
    return {
      success: false,
      error: message,
      statusCode: 401,
    }
  }

  static forbidden(message = "Forbidden") {
    return {
      success: false,
      error: message,
      statusCode: 403,
    }
  }

  static validationError(message = "Validation failed") {
    return {
      success: false,
      error: message,
      statusCode: 422,
    }
  }

  static serverError(message = "Internal server error") {
    return {
      success: false,
      error: message,
      statusCode: 500,
    }
  }
}
