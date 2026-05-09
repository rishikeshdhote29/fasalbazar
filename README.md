# 🌾 FasalBazar – Farm-to-Market E-Commerce Platform

FasalBazar is a full-stack e-commerce platform that connects **farmers (sellers)** directly with **buyers (users)**. Sellers can list agricultural products, and buyers can browse, add to cart, and place orders.

---

## 📁 Project Structure

```
fasalbazar/
├── backend/          # Node.js + Express REST API
│   ├── controllers/  # Business logic
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route definitions
│   ├── middleware/   # Auth & error handling
│   └── utils/        # Helpers (email, cloudinary, etc.)
└── frontend/         # React + Vite SPA
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- SMTP credentials (for email notifications)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Start the server:

```bash
node server.js
# or with nodemon
npx nodemon server.js
```

Server runs on **http://localhost:3030**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication

All protected endpoints require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <token>
```

- **User token** is obtained from `POST /api/auth/login`
- **Seller token** is obtained from `POST /api/seller/auth/login`
- Tokens expire after **10 days**

---

## 📡 API Reference

Base URL: `http://localhost:3030`

---

### 🩺 Health Check

| Method | Endpoint       | Access |
|--------|----------------|--------|
| GET    | `/api/health`  | Public |

**Response `200`:**
```json
{
  "status": "ok",
  "service": "fasalbazar-backend",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 👤 User Authentication — `/api/auth`

### Register User

`POST /api/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "user register successfully"
}
```

---

### Login User

`POST /api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response `200`:**
```json
{
  "status": "success",
  "message": "user logged in successfully",
  "user": {
    "name": "John Doe",
    "token": "<jwt_token>",
    "email": "john@example.com",
    "address": null,
    "pincode": null,
    "avatar": "<url>",
    "role": "user"
  }
}
```

---

### Get User Profile

`GET /api/auth/profile`

**Access:** Private (User Token required)

**Response `200`:**
```json
{
  "status": "success",
  "message": "user profile fetched successfully",
  "user": {
    "_id": "<id>",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "<url>",
    "address": "123 Street",
    "pincode": "400001",
    "mobileNo": "9876543210",
    "role": "user"
  }
}
```

---

### Update User Profile

`PUT /api/auth/update-profile`

**Access:** Private (User Token required)

**Content-Type:** `multipart/form-data`

| Field     | Type   | Required | Description                |
|-----------|--------|----------|----------------------------|
| name      | String | No       | Display name               |
| address   | String | No       | Delivery address           |
| pincode   | String | No       | Postal code                |
| mobileNo  | String | No       | Phone number               |
| image     | File   | No       | Profile picture (uploaded to Cloudinary) |

**Response `200`:**
```json
{
  "status": "success",
  "message": "user profile updated",
  "newUser": { ... }
}
```

---

### Forgot Password (User)

`POST /api/auth/forget-password`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response `200`:**
```json
{
  "status": "success",
  "message": "password reset token sent to your email successfully"
}
```

---

### Reset Password (User)

`PUT /api/auth/reset-password/:token`

**Access:** Public

**URL Params:** `token` — reset token received via email

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response `200`:**
```json
{
  "status": "success",
  "message": "Password reset  successfully"
}
```

---

## 🏪 Seller Authentication — `/api/seller/auth`

### Register Seller

`POST /api/seller/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "Farm Fresh Co.",
  "email": "seller@example.com",
  "password": "yourpassword"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Seller register successfully"
}
```

---

### Login Seller

`POST /api/seller/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "seller@example.com",
  "password": "yourpassword"
}
```

**Response `200`:**
```json
{
  "status": "success",
  "message": "Seller logged in successfully",
  "user": {
    "name": "Farm Fresh Co.",
    "token": "<jwt_token>",
    "avatar": "<url>",
    "email": "seller@example.com",
    "address": null,
    "pincode": null,
    "role": "seller"
  }
}
```

---

### Get Seller Profile

`GET /api/seller/auth/profile`

**Access:** Private (Seller Token required)

**Response `200`:**
```json
{
  "status": "success",
  "message": "Seller profile fetched successfuly",
  "seller": {
    "_id": "<id>",
    "name": "Farm Fresh Co.",
    "email": "seller@example.com",
    "avatar": "<url>",
    "address": "Village Road",
    "pincode": "400002",
    "products": ["<product_id>", "..."],
    "orders": ["<order_id>", "..."],
    "role": "seller"
  }
}
```

---

### Update Seller Profile

`PUT /api/seller/auth/update-seller-profile`

**Access:** Private (Seller Token required)

**Content-Type:** `multipart/form-data`

| Field    | Type   | Required | Description                        |
|----------|--------|----------|------------------------------------|
| name     | String | No       | Business name                      |
| address  | String | No       | Business address                   |
| pincode  | String | No       | Postal code                        |
| mobileNo | String | No       | Contact number                     |
| image    | File   | No       | Profile picture (uploaded to Cloudinary) |

**Response `200`:**
```json
{
  "status": "success",
  "message": "seller profile updated",
  "newUser": { ... }
}
```

---

### Forgot Password (Seller)

`POST /api/seller/auth/forget-password`

**Access:** Public

**Request Body:**
```json
{
  "email": "seller@example.com"
}
```

**Response `200`:**
```json
{
  "status": "success",
  "message": "password reset token sent to your email successfully"
}
```

---

### Reset Password (Seller)

`PUT /api/seller/auth/reset-password/:token`

**Access:** Public

**URL Params:** `token` — reset token received via email

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response `200`:**
```json
{
  "status": "success",
  "message": "Password reset  successfully"
}
```

---

## 🛒 Products — `/api/product`

### Create Product

`POST /api/product/create`

**Access:** Private (Seller Token required)

**Content-Type:** `multipart/form-data`

| Field       | Type   | Required | Description                              |
|-------------|--------|----------|------------------------------------------|
| name        | String | Yes      | Product name                             |
| price       | Number | Yes      | Price per unit (in ₹)                    |
| description | String | Yes      | Product description                      |
| quantity    | Number | Yes      | Available stock (must be > 0)            |
| unit        | String | No       | Unit of measurement (e.g., kg, dozen)    |
| discount    | Number | No       | Discount percentage (default: 0)         |
| category    | String | No       | Category ID (ObjectId)                   |
| image       | File   | No       | Product image (uploaded to Cloudinary)   |

**Response `201`:**
```json
{
  "status": "success",
  "message": "new product created",
  "newProduct": {
    "_id": "<id>",
    "name": "Fresh Tomatoes",
    "price": 40,
    "description": "Organic farm-fresh tomatoes",
    "images": "<cloudinary_url>",
    "quantity": 100,
    "unit": "kg",
    "discount": 0,
    "isAvailable": true,
    "isInactive": false,
    "seller": "<seller_id>",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get All Products

`GET /api/product/getAllProducts`

**Access:** Public

**Query Parameters:**

| Param  | Type   | Default  | Description                                               |
|--------|--------|----------|-----------------------------------------------------------|
| page   | Number | 1        | Page number for pagination                                |
| limit  | Number | 5        | Number of products per page                               |
| sortBy | String | `newest` | Sort order: `newest`, `oldest`, `price-asc`, `price-desc`, `name-asc`, `name-desc` |

**Example:** `GET /api/product/getAllProducts?page=1&limit=10&sortBy=price-asc`

**Response `200`:**
```json
{
  "status": "success",
  "message": "products fetched successfully",
  "products": [ { ... }, { ... } ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "sortBy": "price-asc",
    "hasMore": true
  }
}
```

---

### Search Products

`GET /api/product/search`

**Access:** Public

**Query Parameters:**

| Param | Type   | Required | Description                             |
|-------|--------|----------|-----------------------------------------|
| q     | String | Yes      | Search keyword (matches name or description) |

**Example:** `GET /api/product/search?q=tomato`

**Response `200`:**
```json
{
  "status": "success",
  "message": "search results",
  "products": [ { ... }, { ... } ]
}
```

---

### Get Seller's Product Listings

`GET /api/product/seller/listing`

**Access:** Private (Seller Token required)

**Response `200`:**
```json
{
  "status": "success",
  "message": "seller listing",
  "listings": [ { ... }, { ... } ]
}
```

---

### Get Product Details

`GET /api/product/:id`

**Access:** Public

**URL Params:** `id` — Product ObjectId

**Response `200`:**
```json
{
  "status": "success",
  "message": "product details fetched successfully",
  "product": {
    "_id": "<id>",
    "name": "Fresh Tomatoes",
    "price": 40,
    "description": "Organic farm-fresh tomatoes",
    "images": "<url>",
    "quantity": 95,
    "unit": "kg",
    "discount": 0,
    "isAvailable": true,
    "seller": "<seller_id>",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Product

`PUT /api/product/update/:id`

**Access:** Private (Seller Token required — seller must own the product)

**Content-Type:** `multipart/form-data`

| Field       | Type   | Required | Description                            |
|-------------|--------|----------|----------------------------------------|
| name        | String | No       | Updated product name                   |
| price       | Number | No       | Updated price                          |
| description | String | No       | Updated description                    |
| quantity    | Number | No       | Updated stock quantity                 |
| unit        | String | No       | Updated unit                           |
| discount    | Number | No       | Updated discount                       |
| image       | File   | No       | Updated image (uploaded to Cloudinary) |

**Response `200`:**
```json
{
  "status": "success",
  "message": "products updated successfully",
  "product": { ... }
}
```

---

### Delete Product

`DELETE /api/product/delete-product/:id`

**Access:** Private (Seller Token required — seller must own the product)

**URL Params:** `id` — Product ObjectId

> Soft delete: sets `isInactive = true` and `isAvailable = false`

**Response `201`:**
```json
{
  "status": "success",
  "message": "product deleted successfully"
}
```

---

## 🛍️ Cart — `/api/cart`

### Add / Update Item in Cart

`PUT /api/cart/add-to-cart/:id`

**Access:** Private (User Token required)

**URL Params:** `id` — Product ObjectId

**Request Body:**
```json
{
  "quantity": 3
}
```

> If the product already exists in the cart, its quantity is updated. Stock availability is validated before adding.

**Response `201`:**
```json
{
  "status": "success",
  "message": "Product added successfully",
  "finalCart": {
    "_id": "<cart_id>",
    "buyer": "<user_id>",
    "products": [
      { "product": "<product_id>", "quantity": 3 }
    ]
  }
}
```

**Error Responses:**
- `400` — Product not available or insufficient stock
- `404` — User or product not found

---

### Remove Item from Cart

`PUT /api/cart/delete-form-cart/:id`

**Access:** Private (User Token required)

**URL Params:** `id` — Product ObjectId

**Response `201`:**
```json
{
  "status": "success",
  "message": "product deleted successfully",
  "cart": { ... }
}
```

---

### Get Cart

`GET /api/cart/get-cart`

**Access:** Private (User Token required)

**Response `200`:**
```json
{
  "status": "success",
  "message": "cart fetched successfully",
  "cart": {
    "_id": "<cart_id>",
    "buyer": "<user_id>",
    "products": [
      {
        "product": {
          "_id": "<product_id>",
          "name": "Fresh Tomatoes",
          "price": 40,
          "images": "<url>",
          "quantity": 95
        },
        "quantity": 3
      }
    ]
  }
}
```

---

## 📦 Orders — `/api/order`

### Place Order

`POST /api/order/create-order`

**Access:** Private (User Token required)

> Creates separate orders for each product in the cart (one order per seller). Cart is cleared after successful order placement. Stock is deducted automatically.

**Request Body:**
```json
{
  "paymentMethod": "upi",
  "address": "123 Main Street, City",
  "pincode": "400001"
}
```

| Field         | Type   | Required | Allowed Values                    |
|---------------|--------|----------|-----------------------------------|
| paymentMethod | String | Yes      | `upi`, `card`, `netBanking`       |
| address       | String | No       | Defaults to user's saved address  |
| pincode       | String | No       | Defaults to user's saved pincode  |

**Response `200`:**
```json
{
  "status": "success",
  "message": "order placed successfully",
  "orderArr": [
    {
      "_id": "<order_id>",
      "orderId": "ORD-XXXXXX",
      "trackingId": "TRK-XXXXXX",
      "status": "order placed",
      "amount": 120,
      "quantity": 3,
      "paymentMethod": "upi",
      "address": "123 Main Street, City",
      "pincode": "400001",
      "product": "<product_id>",
      "buyer": "<user_id>",
      "seller": "<seller_id>",
      "orderDate": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `400` — Insufficient stock for a product

---

### Get Order Details (by Order ID)

`GET /api/order/get-details/:id`

**Access:** Private (User Token required)

**URL Params:** `id` — Order ObjectId

**Response `200`:**
```json
{
  "status": "success",
  "message": "order details fetched successfully",
  "order": {
    "_id": "<id>",
    "orderId": "ORD-XXXXXX",
    "trackingId": "TRK-XXXXXX",
    "status": "order placed",
    "amount": 120,
    "quantity": 3,
    "paymentMethod": "upi",
    "address": "123 Main Street",
    "pincode": "400001",
    "orderDate": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Track Order (by Tracking ID)

`GET /api/order/get-details-tackingId/:trackingId`

**Access:** Public

**URL Params:** `trackingId` — Tracking ID string (e.g., `TRK-XXXXXX`)

**Response `200`:**
```json
{
  "status": "success",
  "message": "order details fetched successfully",
  "order": {
    "_id": "<id>",
    "orderId": "ORD-XXXXXX",
    "trackingId": "TRK-XXXXXX",
    "status": "shipped",
    "amount": 120,
    "product": { "_id": "<id>", "name": "Fresh Tomatoes", ... },
    "buyer": { "_id": "<id>", "name": "John Doe", ... }
  }
}
```

---

### Get All User Orders

`GET /api/order/get-orders-list`

**Access:** Private (User Token required)

**Response `200`:**
```json
{
  "status": "success",
  "message": "order details list fetched successfully",
  "orders": [
    {
      "_id": "<order_id>",
      "orderId": "ORD-XXXXXX",
      "status": "delivered",
      "amount": 120,
      "product": { ... }
    }
  ]
}
```

---

### Get All Seller Orders

`GET /api/order/get-seller-orders-list`

**Access:** Private (Seller Token required)

**Response `200`:**
```json
{
  "status": "success",
  "message": "order details list fetched successfully",
  "orders": [
    {
      "_id": "<order_id>",
      "orderId": "ORD-XXXXXX",
      "status": "processing",
      "amount": 120,
      "product": { ... }
    }
  ]
}
```

---

### Get Single Order Detail (Seller)

`GET /api/order/get-seller-details/:id`

**Access:** Private (Seller Token required — seller must own the order)

**URL Params:** `id` — Order's `orderId` string (not the ObjectId)

**Response `200`:**
```json
{
  "status": "success",
  "message": "order fetched",
  "order": {
    "_id": "<id>",
    "orderId": "ORD-XXXXXX",
    "status": "processing",
    "product": { ... },
    "buyer": { ... }
  }
}
```

---

### Update Order Status (Seller)

`PUT /api/order/update-order-status/:id`

**Access:** Private (Seller Token required — seller must own the order)

**URL Params:** `id` — Order ObjectId

**Request Body:**
```json
{
  "status": "shipped"
}
```

| Allowed Status Values  |
|------------------------|
| `order placed`         |
| `processing`           |
| `shipped`              |
| `out for delivery`     |
| `delivered`            |
| `cancelled`            |

> Setting status to `cancelled` restores product stock and sends a cancellation email to the buyer.

**Response `200`:**
```json
{
  "status": "success",
  "message": "order status updated",
  "order": { ... }
}
```

---

### Cancel Order (User)

`PUT /api/order/cancel-order/:id`

**Access:** Private (User Token required — user must be the buyer)

**URL Params:** `id` — Order ObjectId

> Cancelling an order automatically restores product stock and sends a cancellation email to the buyer.

**Response `200`:**
```json
{
  "status": "success",
  "message": "order cancelled successfully",
  "orderDetails": {
    "_id": "<id>",
    "status": "cancelled",
    ...
  }
}
```

---

## 📊 Data Models

### User
| Field               | Type     | Description                       |
|---------------------|----------|-----------------------------------|
| name                | String   | Full name                         |
| email               | String   | Email address (unique)            |
| password            | String   | Hashed password                   |
| avatar              | String   | Profile picture URL               |
| mobileNo            | String   | Phone number                      |
| address             | String   | Default delivery address          |
| pincode             | String   | Default postal code               |
| cart                | ObjectId | Reference to Cart                 |
| orders              | ObjectId[]| List of order references         |

### Seller
| Field    | Type      | Description                   |
|----------|-----------|-------------------------------|
| name     | String    | Business/farm name            |
| email    | String    | Email address (unique)        |
| password | String    | Hashed password               |
| avatar   | String    | Profile picture URL           |
| address  | String    | Business address              |
| mobileNo | String    | Contact number                |
| pincode  | String    | Postal code                   |
| products | ObjectId[]| Listed product references     |
| orders   | ObjectId[]| Received order references     |

### Product
| Field       | Type     | Description                         |
|-------------|----------|-------------------------------------|
| name        | String   | Product name                        |
| price       | Number   | Price per unit (₹)                  |
| description | String   | Product description                 |
| images      | String   | Image URL (Cloudinary)              |
| discount    | Number   | Discount % (default: 0)             |
| quantity    | Number   | Available stock (default: 1)        |
| unit        | String   | Unit (kg, dozen, piece, etc.)       |
| category    | ObjectId | Category reference                  |
| seller      | ObjectId | Seller reference                    |
| isAvailable | Boolean  | Whether product can be purchased    |
| isInactive  | Boolean  | Soft delete flag                    |

### Order
| Field         | Type     | Description                                                    |
|---------------|----------|----------------------------------------------------------------|
| orderId       | String   | Human-readable order ID (e.g., `ORD-XXXXXX`)                  |
| trackingId    | String   | Tracking ID (e.g., `TRK-XXXXXX`)                              |
| status        | String   | `order placed` / `processing` / `shipped` / `out for delivery` / `delivered` / `cancelled` |
| buyer         | ObjectId | User reference                                                 |
| seller        | ObjectId | Seller reference                                               |
| product       | ObjectId | Product reference                                              |
| quantity      | Number   | Number of units ordered                                        |
| amount        | Number   | Total order amount (₹)                                         |
| paymentMethod | String   | `upi` / `card` / `netBanking`                                  |
| address       | String   | Delivery address                                               |
| pincode       | String   | Delivery postal code                                           |
| orderDate     | Date     | Date/time of order placement                                   |

### Cart
| Field    | Type     | Description                        |
|----------|----------|------------------------------------|
| buyer    | ObjectId | User reference                     |
| products | Array    | `[{ product: ObjectId, quantity: Number }]` |

---

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "status": "fail",
  "message": "Error description here"
}
```

| HTTP Status | Meaning                        |
|-------------|--------------------------------|
| 400         | Bad request / validation error |
| 401         | Unauthorized (missing/invalid token) |
| 403         | Forbidden (insufficient permissions) |
| 404         | Resource not found             |
| 500         | Internal server error          |

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose                  |
| Auth      | JSON Web Tokens (JWT) + bcrypt      |
| Images    | Cloudinary + Multer                 |
| Email     | Nodemailer                          |
| Frontend  | React + Vite                        |

---

## 📧 Email Notifications

The platform sends automated emails for:

- **Password Reset** — Sent to user/seller with a reset link (token expires in 10 minutes)
- **Order Confirmation** — Sent to buyer when an order is placed
- **Order Cancellation** — Sent to buyer when an order is cancelled (by buyer or seller)

---

## 📝 License

This project is licensed under the ISC License.
