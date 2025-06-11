# Luxury Furniture Website - Project Documentation

## Project Overview
This is a full-stack e-commerce website for Eight Hands Work, a luxury epoxy furniture company. Built with Next.js 15, Supabase, and Tailwind CSS.

## Architecture

### Frontend (Next.js App Router)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for future file uploads)
- **Real-time**: Supabase Realtime (for future features)

## File Structure

### Frontend Files

#### Core Application Files
- `app/layout.jsx` - Root layout component with providers
- `app/page.jsx` - Homepage with hero, features, products showcase
- `app/globals.css` - Global styles and Tailwind utilities

#### Authentication Pages
- `app/login/page.jsx` - User login with admin quick login
- `app/register/page.jsx` - User registration form
- `app/login/loading.jsx` - Loading component for login page

#### Product Pages
- `app/products/page.jsx` - Product listing with filters and search
- `app/products/[id]/page.jsx` - Individual product details
- `app/products/loading.jsx` - Loading component for products

#### E-commerce Pages
- `app/cart/page.jsx` - Shopping cart with checkout
- `app/orders/page.jsx` - User order history
- `app/order-success/page.jsx` - Order confirmation page
- `app/order-success/loading.jsx` - Loading component

#### User Account Pages
- `app/account/page.jsx` - User profile and account management

#### Admin Pages
- `app/admin/page.jsx` - Admin redirect to dashboard
- `app/admin/layout.jsx` - Admin layout wrapper
- `app/admin/dashboard/page.jsx` - Admin dashboard with statistics
- `app/admin/products/page.jsx` - Product management interface
- `app/admin/products/new/page.jsx` - Add new product form
- `app/admin/products/loading.jsx` - Loading component
- `app/admin/orders/page.jsx` - Order management interface
- `app/admin/orders/loading.jsx` - Loading component
- `app/admin/messages/page.jsx` - Contact message management
- `app/admin/messages/loading.jsx` - Loading component
- `app/admin/categories/page.jsx` - Category management

#### Static Pages
- `app/about/page.jsx` - About us page
- `app/contact/page.jsx` - Contact form and information

### Component Files

#### Layout Components
- `components/header.jsx` - Main navigation with mega menu
- `components/footer.jsx` - Site footer with links and info
- `components/mega-menu.jsx` - Product category mega menu

#### Homepage Components
- `components/hero.jsx` - Hero section with call-to-action
- `components/featured-products.jsx` - Product showcase grid
- `components/features-section.jsx` - Service features display
- `components/about-section.jsx` - Company information section
- `components/room-showcase.jsx` - Room category showcase
- `components/achievements.jsx` - Client achievements display
- `components/contact-form.jsx` - Contact form component

### Backend/Library Files

#### Database & API Layer
- `lib/supabase-client.js` - Supabase client configuration
- `lib/supabase-provider.jsx` - React context for Supabase
- `lib/database.js` - Database API functions and services

#### State Management
- `lib/cart-context.jsx` - Shopping cart state management

#### Database Scripts
- `scripts/complete-database-setup.sql` - Complete database schema
- `scripts/setup-database.sql` - Basic table creation (legacy)

### Configuration Files
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `.env.local.example` - Environment variables template

### Static Assets
- `public/logo.png` - Company logo
- `public/hero-bg.png` - Hero background image
- `public/product1.png` - Sample product image
- `public/product2.png` - Sample product image

## Database Schema

### Tables

#### users
- `id` (UUID, Primary Key) - References auth.users
- `email` (TEXT, Unique) - User email
- `full_name` (TEXT) - User's full name
- `phone` (TEXT) - Phone number
- `address` (TEXT) - User address
- `is_admin` (BOOLEAN) - Admin flag
- `created_at`, `updated_at` (TIMESTAMP)

#### categories
- `id` (UUID, Primary Key)
- `name` (TEXT, Unique) - Category name
- `description` (TEXT) - Category description
- `created_at`, `updated_at` (TIMESTAMP)

#### products
- `id` (UUID, Primary Key)
- `name` (TEXT) - Product name
- `description` (TEXT) - Product description
- `price` (DECIMAL) - Product price
- `image_url` (TEXT) - Product image URL
- `category` (TEXT) - Product category
- `in_stock` (BOOLEAN) - Stock status
- `created_at`, `updated_at` (TIMESTAMP)

#### orders
- `id` (UUID, Primary Key)
- `user_id` (UUID) - References users.id
- `total_amount` (DECIMAL) - Order total
- `shipping_address` (TEXT) - Delivery address
- `phone` (TEXT) - Contact phone
- `status` (TEXT) - Order status
- `created_at`, `updated_at` (TIMESTAMP)

#### order_items
- `id` (UUID, Primary Key)
- `order_id` (UUID) - References orders.id
- `product_id` (UUID) - References products.id
- `quantity` (INTEGER) - Item quantity
- `price` (DECIMAL) - Item price at time of order
- `created_at` (TIMESTAMP)

#### contact_messages
- `id` (UUID, Primary Key)
- `name` (TEXT) - Sender name
- `email` (TEXT) - Sender email
- `message` (TEXT) - Message content
- `is_read` (BOOLEAN) - Read status
- `created_at` (TIMESTAMP)

## API Functions

### Products API (`lib/database.js`)
- `productsAPI.getAll(filters)` - Get all products with optional filters
- `productsAPI.getById(id)` - Get single product by ID
- `productsAPI.create(productData)` - Create new product
- `productsAPI.update(id, productData)` - Update existing product
- `productsAPI.delete(id)` - Delete product

### Categories API
- `categoriesAPI.getAll()` - Get all categories
- `categoriesAPI.create(categoryData)` - Create new category

### Users API
- `usersAPI.getProfile(userId)` - Get user profile
- `usersAPI.createProfile(userData)` - Create user profile
- `usersAPI.updateProfile(userId, userData)` - Update user profile

### Authentication API
- `authAPI.signUp(email, password, userData)` - Register new user
- `authAPI.signIn(email, password)` - User login
- `authAPI.signOut()` - User logout
- `authAPI.createAdminUser()` - Create admin account

### Orders API
- `ordersAPI.create(orderData)` - Create new order
- `ordersAPI.getUserOrders(userId)` - Get user's orders

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Admins have elevated permissions
- Public read access for products and categories

### Authentication
- Supabase Auth handles user authentication
- JWT tokens for session management
- Automatic admin user creation for demo

## Setup Instructions

### 1. Environment Setup
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd luxury-furniture-website

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
\`\`\`

### 2. Supabase Setup
1. Create a new Supabase project
2. Copy your project URL and anon key to `.env.local`
3. Run the database setup script in Supabase SQL Editor
4. Enable Row Level Security on all tables

### 3. Run the Application
\`\`\`bash
npm run dev
\`\`\`

### 4. Admin Access
- Use the "Login as Admin" button on the login page
- This creates an admin account automatically
- Email: admin@example.com
- Password: Admin123!

## Common Issues & Solutions

### 1. Products Not Loading
- Check Supabase connection in browser console
- Verify environment variables are set correctly
- Ensure database tables exist and have data

### 2. Registration Errors
- Check if user already exists
- Verify email format is valid
- Ensure password meets requirements (6+ characters)

### 3. Admin Login Issues
- Use the "Login as Admin" button for first-time setup
- Check if admin user exists in Supabase Auth dashboard
- Verify is_admin flag is set to true in users table

### 4. Hydration Errors
- Ensure `suppressHydrationWarning` is set on html element
- Check for client/server rendering mismatches
- Verify all components are properly wrapped in providers

## Development Workflow

### Adding New Features
1. Create database migrations if needed
2. Update API functions in `lib/database.js`
3. Create/update React components
4. Add proper error handling and loading states
5. Test with both regular users and admin accounts

### Deployment
1. Set up production Supabase project
2. Update environment variables
3. Deploy to Vercel or similar platform
4. Run database setup script on production

## Performance Optimizations

### Frontend
- Image optimization with Next.js Image component
- Lazy loading for product grids
- Client-side caching with React state
- Responsive design for all screen sizes

### Backend
- Database indexing on frequently queried columns
- Row Level Security for data protection
- Efficient query patterns in API functions
- Connection pooling via Supabase

## Future Enhancements

### Planned Features
- Real-time order status updates
- Advanced product filtering
- Wishlist functionality
- Product reviews and ratings
- Email notifications
- Payment gateway integration
- Inventory management
- Advanced admin analytics

### Technical Improvements
- TypeScript migration
- Unit and integration tests
- CI/CD pipeline
- Performance monitoring
- SEO optimization
- PWA features
