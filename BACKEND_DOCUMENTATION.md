# Backend Architecture Documentation

## Overview
This document describes the professional backend architecture for the Luxury Furniture Website. The backend follows a layered architecture pattern with clear separation of concerns.

## Architecture Layers

### 1. Configuration Layer (`backend/config/`)
- **database.js**: Supabase client configuration for both frontend and admin operations

### 2. Model Layer (`backend/models/`)
- **User.js**: User data model with CRUD operations
- **Product.js**: Product data model with search and filtering
- **Category.js**: Category data model
- **Order.js**: Order data model with statistics
- **OrderItem.js**: Order items data model
- **ContactMessage.js**: Contact message data model

### 3. Service Layer (`backend/services/`)
- **UserService.js**: Business logic for user operations
- **ProductService.js**: Business logic for product operations
- **OrderService.js**: Business logic for order operations

### 4. API Routes Layer (`app/api/`)
- RESTful API endpoints following Next.js App Router conventions
- Proper HTTP methods and status codes
- Standardized request/response format

### 5. Middleware Layer (`backend/middleware/`)
- **auth.js**: Authentication and authorization middleware

### 6. Utilities Layer (`backend/utils/`)
- **validation.js**: Input validation functions
- **response.js**: Standardized API response helpers

## File Structure

\`\`\`
backend/
├── config/
│   └── database.js              # Supabase configuration
├── models/
│   ├── User.js                  # User model
│   ├── Product.js               # Product model
│   ├── Category.js              # Category model
│   ├── Order.js                 # Order model
│   ├── OrderItem.js             # Order item model
│   └── ContactMessage.js        # Contact message model
├── services/
│   ├── UserService.js           # User business logic
│   ├── ProductService.js        # Product business logic
│   └── OrderService.js          # Order business logic
├── middleware/
│   └── auth.js                  # Authentication middleware
└── utils/
    ├── validation.js            # Validation utilities
    └── response.js              # Response utilities

app/api/                         # API Routes
├── products/
│   ├── route.js                 # GET, POST /api/products
│   ├── [id]/route.js           # GET, PUT, DELETE /api/products/[id]
│   ├── featured/route.js        # GET /api/products/featured
│   └── search/route.js          # GET /api/products/search
├── categories/
│   └── route.js                 # GET, POST /api/categories
├── orders/
│   ├── route.js                 # GET, POST /api/orders
│   └── [id]/route.js           # GET, PUT, DELETE /api/orders/[id]
├── users/
│   ├── route.js                 # GET, POST /api/users
│   └── [id]/route.js           # GET, PUT, DELETE /api/users/[id]
├── contact/
│   ├── route.js                 # GET, POST /api/contact
│   └── [id]/route.js           # GET, PUT, DELETE /api/contact/[id]
├── auth/
│   ├── register/route.js        # POST /api/auth/register
│   ├── login/route.js           # POST /api/auth/login
│   └── admin/route.js           # POST /api/auth/admin
└── stats/
    └── route.js                 # GET /api/stats

lib/
└── api-client.js                # Frontend API client
\`\`\`

## API Endpoints

### Products API
- `GET /api/products` - Get all products with filters
- `POST /api/products` - Create new product (admin)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products

### Categories API
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (admin)

### Orders API
- `GET /api/orders` - Get orders with filters
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID
- `PUT /api/orders/[id]` - Update order
- `DELETE /api/orders/[id]` - Delete order (admin)

### Users API
- `GET /api/users` - Get all users (admin)
- `POST /api/users` - Create user profile
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile
- `DELETE /api/users/[id]` - Delete user (admin)

### Contact API
- `GET /api/contact` - Get contact messages (admin)
- `POST /api/contact` - Create contact message
- `GET /api/contact/[id]` - Get contact message (admin)
- `PUT /api/contact/[id]` - Mark as read/unread (admin)
- `DELETE /api/contact/[id]` - Delete message (admin)

### Auth API
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin` - Create admin user

### Stats API
- `GET /api/stats` - Get dashboard statistics (admin)

## Data Models

### User Model
\`\`\`javascript
{
  id: UUID,
  email: string,
  full_name: string,
  phone: string,
  address: string,
  is_admin: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
\`\`\`

### Product Model
\`\`\`javascript
{
  id: UUID,
  name: string,
  description: string,
  price: decimal,
  image_url: string,
  category: string,
  in_stock: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
\`\`\`

### Order Model
\`\`\`javascript
{
  id: UUID,
  user_id: UUID,
  total_amount: decimal,
  shipping_address: string,
  phone: string,
  status: string,
  created_at: timestamp,
  updated_at: timestamp,
  order_items: OrderItem[]
}
\`\`\`

## Security Features

### Authentication
- JWT token-based authentication via Supabase Auth
- Admin role verification
- Resource ownership validation

### Authorization
- Role-based access control (RBAC)
- Row Level Security (RLS) in database
- API endpoint protection

### Data Validation
- Input sanitization
- Type validation
- Business rule validation

## Error Handling

### Standardized Responses
\`\`\`javascript
// Success Response
{
  success: true,
  data: any,
  message?: string
}

// Error Response
{
  success: false,
  error: string
}
\`\`\`

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Usage Examples

### Frontend API Client Usage
\`\`\`javascript
import { apiClient } from '@/lib/api-client'

// Get products
const products = await apiClient.getProducts({ category: 'Dining Table' })

// Create order
const order = await apiClient.createOrder(orderData, orderItems)

// Search products
const results = await apiClient.searchProducts('epoxy table')
\`\`\`

### Service Layer Usage
\`\`\`javascript
import { ProductService } from '@/backend/services/ProductService'

// In API route
const result = await ProductService.createProduct(productData)
if (!result.success) {
  return NextResponse.json({ error: result.error }, { status: 400 })
}
\`\`\`

## Development Guidelines

### Adding New Features
1. Create/update model in `backend/models/`
2. Add business logic in `backend/services/`
3. Create API routes in `app/api/`
4. Update frontend API client
5. Add proper validation and error handling

### Testing
- Test all API endpoints with different scenarios
- Validate authentication and authorization
- Test error handling and edge cases
- Verify data integrity and business rules

### Performance Considerations
- Use database indexing for frequently queried fields
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize database queries

## Deployment Notes

### Environment Variables
\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
\`\`\`

### Database Setup
1. Run the complete database setup script
2. Configure Row Level Security policies
3. Set up proper indexes for performance
4. Insert sample data for testing

This backend architecture provides a solid foundation for the luxury furniture e-commerce platform with proper separation of concerns, security, and scalability.
