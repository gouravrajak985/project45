# GumClone - A Gumroad Clone with MERN Stack

A full-stack e-commerce platform for creators to sell digital and physical products directly to their audience.

## Features

### Authentication
- ✅ Email & password-based signup/login
- ✅ JWT authentication
- ✅ Role-based access: Sellers, Buyers, and Admin

### Seller Dashboard
- ✅ CRUD functionality for digital & physical products
- ✅ Image uploads via Cloudinary
- ✅ Product management with detailed fields
- ✅ Order & customer details management

### Storefront (User Side)
- ✅ Browse products with search & category filters
- ✅ Product detail page with image preview, description, and price
- ✅ Cart & checkout system with Stripe integration
- ✅ Order history and tracking

### Order Management
- ✅ Buyers can view order history
- ✅ Digital products: Download after purchase
- ✅ Physical products: Track shipping status

### Admin Panel
- ✅ Manage sellers, buyers, and products
- ✅ Approve/reject product listings

## Tech Stack

### Frontend
- React.js with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- Cloudinary for image storage
- Stripe for payment processing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/gumroad-clone.git
cd gumroad-clone
```

2. Install dependencies
```
npm run install:all
```

3. Set up environment variables
   - Create a `.env` file in the backend directory based on `.env.sample`

4. Start the development server
```
npm run dev
```

## Project Structure

```
gumroad-clone/
├── frontend/           # React.js frontend
│   ├── public/         # Static files
│   └── src/            # Source files
│       ├── components/ # Reusable components
│       ├── screens/    # Page components
│       ├── slices/     # Redux slices
│       └── ...
└── backend/            # Express.js backend
    ├── config/         # Configuration files
    ├── controllers/    # Route controllers
    ├── middleware/     # Custom middleware
    ├── models/         # Mongoose models
    ├── routes/         # API routes
    └── ...
```

## API Endpoints

### Auth
- POST /api/users/login - Login user
- POST /api/users - Register user
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product
- GET /api/products/seller - Get seller products
- PUT /api/products/:id/approve - Approve product

### Orders
- POST /api/orders - Create order
- GET /api/orders/:id - Get order by ID
- PUT /api/orders/:id/pay - Update order to paid
- PUT /api/orders/:id/deliver - Update order to delivered
- GET /api/orders/myorders - Get logged in user orders
- GET /api/orders/sellerorders - Get seller orders

## License
MIT