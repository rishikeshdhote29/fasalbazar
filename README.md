# FasalBazar

FasalBazar is a full-stack agriculture marketplace platform with separate user and seller flows. Buyers can browse products, manage cart/orders, and track deliveries. Sellers can list products and manage incoming orders.

## Repository Structure

- `frontend/` — React + Vite client app
- `backend/` — Node.js + Express + MongoDB API

## Tech Stack

### Frontend
- React
- Redux Toolkit
- React Router
- Vite
- Tailwind CSS + Bootstrap
- Axios

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- Multer + Cloudinary (image uploads)
- Nodemailer (emails)

## Core Features

- User and seller authentication
- Product listing and product search
- Cart management
- Order creation and cancellation
- Seller order management and status updates
- Public order tracking by tracking ID
- Profile management for users and sellers
- Forgot/reset password flows

## API Base URL

Backend runs on:

- `http://localhost:3030`
- Health check: `GET /api/health`

Frontend uses:

- `VITE_BASE_URL` (default fallback: `http://localhost:3030/api`)

## API Documentation

Base URL (local): `http://localhost:3030/api`

**Auth**
- Protected routes require `Authorization: Bearer <token>`.
- Buyer tokens come from `/api/auth/login`; seller tokens come from `/api/seller/auth/login`.

**Uploads**
- Profile and product image uploads use `multipart/form-data` with `image` field.

### Health
- `GET /api/health` — service health check.

### Buyer Authentication & Profile
- `POST /api/auth/register` — register buyer. Body: `{ name, email, password }`
- `POST /api/auth/login` — login buyer. Body: `{ email, password }`
- `GET /api/auth/profile` — get buyer profile (auth).
- `PUT /api/auth/update-profile` — update buyer profile (auth, multipart). Body fields: `{ name, email, address, pincode, avatar? }`
- `POST /api/auth/forget-password` — request reset token. Body: `{ email }`
- `PUT /api/auth/reset-password/:token` — reset password. Body: `{ password }`

### Seller Authentication & Profile
- `POST /api/seller/auth/register` — register seller. Body: `{ name, email, password }`
- `POST /api/seller/auth/login` — login seller. Body: `{ email, password }`
- `GET /api/seller/auth/profile` — get seller profile (auth).
- `PUT /api/seller/auth/update-seller-profile` — update seller profile (auth, multipart). Body fields: `{ name, email, address, pincode, avatar? }`
- `POST /api/seller/auth/forget-password` — request reset token. Body: `{ email }`
- `PUT /api/seller/auth/reset-password/:token` — reset password. Body: `{ password }`

### Products
- `POST /api/product/create` — create product (seller auth, multipart). Body fields: `{ name, price, description, quantity, unit, category, discount }`
- `PUT /api/product/update/:id` — update product (seller auth, multipart). Body fields: same as create.
- `DELETE /api/product/delete-product/:id` — soft delete product (seller auth).
- `GET /api/product/getAllProducts` — list products. Query: `page`, `limit`, `sortBy` (`newest|oldest|price-asc|price-desc|name-asc|name-desc`)
- `GET /api/product/search` — search products. Query: `q`
- `GET /api/product/seller/listing` — seller’s own listings (seller auth).
- `GET /api/product/:id` — product details.

### Cart
- `PUT /api/cart/add-to-cart/:id` — add/update product in cart (buyer auth). Body: `{ quantity }`
- `PUT /api/cart/delete-form-cart/:id` — remove product from cart (buyer auth).
- `GET /api/cart/get-cart` — fetch cart (buyer auth).

### Orders
- `POST /api/order/create-order` — place order (buyer auth). Body: `{ paymentMethod, address, pincode }`
- `GET /api/order/get-details/:id` — buyer order details (buyer auth).
- `GET /api/order/get-details-tackingId/:trackingId` — public order tracking.
- `GET /api/order/get-orders-list` — buyer order list (buyer auth).
- `PUT /api/order/cancel-order/:id` — cancel order (buyer auth).
- `GET /api/order/get-seller-orders-list` — seller order list (seller auth).
- `GET /api/order/get-seller-details/:id` — seller order details by orderId (seller auth).
- `PUT /api/order/update-order-status/:id` — update status (seller auth). Body: `{ status }` where status is one of `order placed`, `processing`, `shipped`, `out for delivery`, `delivered`, `cancelled`.

## Environment Variables

Create `backend/.env` and configure at least:

- `MONGO_URI` (optional for local setup; defaults to
  `mongodb://localhost:27017/fasalbazar`. Set this explicitly when using a
  remote/managed MongoDB instance. For production deployments, set `MONGO_URI`
  explicitly.)
- `JWT_SECRET`
- `GMAIL_USER`
- `APP_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_SECRET_KEY`

Optional frontend env (`frontend/.env`):

- `VITE_BASE_URL=http://localhost:3030/api`

## Local Setup

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2) Start backend

```bash
cd backend
node server.js
```

Server listens on port `3030`.

### 3) Start frontend

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in terminal (typically `http://localhost:5173`).

## Available Scripts

### Frontend (`frontend/package.json`)

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

### Backend (`backend/package.json`)

- `npm test` (currently placeholder script)

## Notes

- The frontend’s internal `frontend/README.md` is the default Vite template.

## Security Note

⚠️ Backend CORS is currently configured to allow all origins (`*`). Restrict
allowed origins before deploying to production by updating the `cors(...)`
configuration in `backend/server.js` (set `origin` to your trusted frontend
domains).
