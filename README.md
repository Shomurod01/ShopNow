# Full-Stack E-Commerce Application

A complete MERN stack e-commerce platform with Stripe payments, JWT authentication, and admin dashboard.

## Features

- User authentication (register, login, JWT + refresh tokens)
- Product browsing with search, filters, pagination
- Shopping cart (localStorage for guests, MongoDB for logged-in users)
- Stripe payment integration (test mode)
- Order management
- Admin dashboard (manage products, orders, users)
- Responsive design with Tailwind CSS
- Role-based access control
- Product reviews and ratings

## Tech Stack

**Frontend:**

- React 18
- React Router v6
- Context API (state management)
- Axios
- Tailwind CSS
- Stripe React SDK
- React Hook Form

**Backend:**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Stripe API
- Multer (file uploads)
- bcryptjs

## Installation

### Prerequisites

- Node.js >= 18
- MongoDB (local)
- Stripe account (for test keys)

### Setup Steps

1. **Install dependencies:**

```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

2. **Configure environment variables:**

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
CLIENT_URL=http://localhost:5173
```

Create `client/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
```

3. **Get Stripe API Keys:**
   - Go to [dashboard.stripe.com](https://dashboard.stripe.com)
   - Enable Test Mode
   - Navigate to Developers → API Keys
   - Copy keys to `.env` files

4. **Seed database:**

```bash
npm run seed
```

This creates:

- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- 8 sample products

5. **Start the application:**

```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Testing

1. **Login** with demo accounts
2. **Browse products** at `/products`
3. **Add to cart** and checkout
4. **Test payment** with Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
5. **Admin panel** at `/admin` (login as admin)

## Security Features

- Helmet (security headers)
- Rate limiting (100 req/15min per IP)
- NoSQL injection prevention
- XSS protection
- bcrypt password hashing (12 rounds)
- JWT with refresh tokens
- httpOnly cookies
- CORS protection
- Role-based access control

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add review

### Cart

- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update status (admin)

### Payment

- `POST /api/payment/create-payment-intent` - Create Stripe intent

### Admin

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/orders` - Get all orders

## Payment Flow

1. User proceeds to checkout
2. Client requests payment intent from server
3. Server creates Stripe PaymentIntent
4. Client displays Stripe payment form
5. User enters card details
6. Client confirms payment with Stripe
7. On success, client creates order in database
8. Server deducts stock and clears cart
9. Order confirmation displayed

## Deployment Notes

For production deployment:

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for database
3. Add domain to CORS whitelist
4. Enable Stripe live mode
5. Use environment variables for all secrets
6. Consider using Cloudinary for image storage
7. Add email service (SendGrid, Mailgun)
8. Enable HTTPS
9. Set up proper logging
10. Add monitoring (Sentry, LogRocket)
