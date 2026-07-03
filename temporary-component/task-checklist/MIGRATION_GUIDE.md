# MongoDB Atlas & JWT Authentication Migration Guide

## Overview
This document outlines the migration from LocalStorage-based data to MongoDB Atlas with JWT authentication for the Ecommerce-AI platform.

## What Was Changed

### Backend Updates

#### 1. Cart Management (New)
- **Created**: `server/models/Cart.js` - MongoDB schema for user carts
- **Created**: `server/controllers/cartController.js` - CRUD operations for cart
- **Created**: `server/routes/cartRoutes.js` - Cart API endpoints
- **Protected**: All cart operations require JWT authentication

**New Endpoints**:
- `GET /api/cart` - Fetch user's cart
- `POST /api/cart/items` - Add item to cart
- `DELETE /api/cart/items/:productId` - Remove item from cart
- `PUT /api/cart/items/:productId` - Update item quantity
- `DELETE /api/cart` - Clear entire cart

#### 2. Order Management (Enhanced)
- **Updated**: `server/controllers/orderController.js`
  - Now clears user's cart after successful order creation
  - Maintains user association for authenticated orders
  - Supports both authenticated and guest checkouts

#### 3. Authentication (Already Configured)
- Uses JWT tokens for secure authentication
- Passwords hashed with bcryptjs
- Token stored in localStorage with 30-day expiration
- Profile endpoint supports profile updates with password change

### Frontend Updates

#### 1. Cart Context (admin-site & frontend-user)
**File**: `src/context/CartContext.jsx`
- For **authenticated users**: Cart operations sync with MongoDB via API
- For **guest users**: Cart persists in localStorage
- Automatically fetches cart from API when user logs in
- Falls back to localStorage if API unavailable

**Key Functions**:
- `addToCart()` - Add items (API for auth, localStorage for guests)
- `removeFromCart()` - Remove items
- `updateQty()` - Update quantities
- `clearCart()` - Clear cart

#### 2. Orders Helper (admin-site & frontend-user)
**File**: `src/utils/userHelpers.js`
- `getOrders()` - Fetches from `/api/orders/myorders` for authenticated users
- `addOrder()` - Saves order to MongoDB (API primary, localStorage fallback)

#### 3. Profile Management
- Already integrated with API via `AuthContext.updateProfile()`
- Updates persist to MongoDB immediately

## API Architecture

### Authentication Flow
```
1. User registers/logs in
2. Backend validates credentials and hashes passwords with bcryptjs
3. JWT token generated and returned to frontend
4. Token stored in localStorage under `user_token` key
5. Token sent in Authorization header for protected requests
```

### Data Flow (Authenticated Users)

#### Cart Operations
```
Frontend UI → CartContext → API (/api/cart/*) → MongoDB
```

#### Orders
```
Checkout Page → addOrder() → API (/api/orders) → MongoDB
                          → Clear Cart (/api/cart)
```

#### Profile
```
Profile Form → updateProfile() → API (/api/auth/profile) → MongoDB
```

### Data Flow (Guest Users)

#### Cart Operations
```
Frontend UI → CartContext → localStorage ("user_cart")
```

#### Orders
```
Checkout Page → addOrder() → Try API → localStorage fallback
```

## Database Schema

### Cart Model
```javascript
{
  user: ObjectId (ref: User),
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: Number
    }
  ],
  timestamps: true
}
```

### User Model (Existing)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "customer" | "admin",
  phone: String,
  address: String,
  city: String,
  zip: String,
  country: String,
  timestamps: true
}
```

### Order Model (Existing)
```javascript
{
  user: ObjectId (ref: User, optional for guests),
  orderId: String (unique),
  items: [orderItem],
  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,
  status: "Processing" | "Shipped" | "Delivered",
  address: String,
  timestamps: true
}
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (.env.example)
```
VITE_API_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

## How to Use

### For Development

1. **Start Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start Admin Frontend**:
   ```bash
   cd admin-site
   npm install
   npm run dev
   ```

3. **Start User Frontend**:
   ```bash
   cd frontend-user
   npm install
   npm run dev
   ```

### User Authentication Flow

1. **Register**: User creates account → password hashed → saved to MongoDB
2. **Login**: Email + password → JWT token generated → stored in localStorage
3. **Protected Actions**: Requests include token in `Authorization: Bearer {token}` header

### Cart & Orders Flow

**Authenticated User**:
1. Add to cart → API call → MongoDB storage
2. Checkout → Order created → Cart cleared in MongoDB
3. View orders → Fetch from `/api/orders/myorders`

**Guest User**:
1. Add to cart → localStorage only
2. Checkout → Order attempt (may fail without auth) → localStorage backup
3. View orders → localStorage only (limited)

## Security Features

✅ **JWT Authentication**: Secure token-based authentication
✅ **Password Hashing**: bcryptjs with salt rounds
✅ **Protected Routes**: Admin and user-only endpoints
✅ **CORS**: Configured for cross-origin requests
✅ **Authorization Headers**: Bearer token validation

## Backward Compatibility

The system maintains backward compatibility:
- Existing localStorage data for guests is preserved
- Products API returns data with `_id` mapped to `id` for frontend
- Order status values remain unchanged
- Component names and structure preserved
- No UI changes required

## Testing Checklist

- [ ] User registration creates account in MongoDB
- [ ] User login generates valid JWT token
- [ ] Authenticated user can add/remove items from cart (API synced)
- [ ] Cart persists after page refresh (MongoDB for auth, localStorage for guests)
- [ ] Checkout creates order in MongoDB and clears cart
- [ ] User can view order history from MongoDB
- [ ] Profile updates save to MongoDB
- [ ] Admin can view all orders with user details
- [ ] Products from MongoDB display correctly
- [ ] Stock decrements after order
- [ ] Guest checkout still works with localStorage fallback

## Troubleshooting

### Cart not persisting
- Check if user is authenticated (token in localStorage)
- Verify MongoDB connection string
- Check browser console for API errors

### Login failing
- Ensure MongoDB is running and accessible
- Verify JWT_SECRET is set in .env
- Check email/password credentials

### Orders not syncing
- API should be running on localhost:5000
- Check network tab in browser for failed requests
- Verify order structure matches MongoDB schema

## Migration Completed ✅
- LocalStorage → MongoDB for cart, orders, and profiles
- Guest support → localStorage fallback for unauthenticated users
- JWT Authentication → Secure token-based auth
- Password hashing → bcryptjs for security
- All existing features → Preserved and working
