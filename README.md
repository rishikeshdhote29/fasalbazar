# FasalBazar

FasalBazar is a full-stack agricultural marketplace that connects buyers with sellers/farmers. It includes separate buyer and seller workflows, product management, cart and checkout, Razorpay payments, order management, public order tracking, and password reset.

## Features

### Buyers

- Register, log in, and manage profiles and avatars
- Browse, search, and view products
- Add products to a cart and update quantities
- Checkout and pay through Razorpay
- View and cancel orders
- Track orders using a public tracking ID

### Sellers/Farmers

- Register, log in, and manage seller profiles
- Create, update, and deactivate product listings
- Upload product and profile images
- View buyer orders
- Update order status
- View seller-specific order details

### Platform

- Separate Redux state for buyers and sellers
- Separate buyer and seller frontend routes
- JWT authentication and bcrypt password hashing
- Cloudinary image storage
- Redis-backed product caching
- MongoDB/Mongoose persistence
- Nodemailer password-reset and order emails

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite 8, Redux Toolkit, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express 5, JWT, bcrypt, Multer |
| Database | MongoDB, Mongoose |
| Cache | Redis |
| Images | Cloudinary |
| Payments | Razorpay |
| Email | Nodemailer with Gmail SMTP |

## Project Structure

```text
fasal-bazar/
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   ├── component/
│   │   │   ├── auth/
│   │   │   ├── buyer/
│   │   │   ├── seller/
│   │   │   ├── order/
│   │   │   └── utils/
│   │   └── redux/
│   └── vite.config.js
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── payment/
    ├── routes/
    ├── utils/
    └── server.js
```

## Redux Slices

The frontend keeps buyer and seller state isolated:

- `Users` - buyer authentication and profile
- `Sellers` - seller authentication and profile
- `UserProducts` - buyer catalog, product details, and cart
- `SellerProducts` - seller listings and listing updates
- `UserOrders` - buyer checkout and order history
- `SellerOrders` - seller order management

## Prerequisites

- Node.js 20 or newer
- MongoDB
- Redis
- Cloudinary account
- Gmail account with an app password
- Razorpay test account

## Environment Variables

Copy `backend/.env.example` to `backend/.env`, then configure:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/fasalbazar
JWT_SECRET=replace-with-a-long-random-secret
REDIS_URL=redis://127.0.0.1:6379

CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-api-secret

RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

GMAIL_USER=your-gmail-address
APP_PASSWORD=your-gmail-app-password
BASE_URL=http://localhost:5173
```

The frontend uses `frontend/.env`:

```dotenv
VITE_BASE_URL=http://localhost:3000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

Never commit real credentials or `.env` files.

## Installation

```bash
git clone https://github.com/rishikeshdhote29/fasalbazar.git
cd fasalbazar
```

### Backend

```bash
cd backend
npm install
npx nodemon server.js
```

The API runs on `http://localhost:3000`.

### Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally runs on `http://localhost:5173`.

## Available Frontend Commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## Main API Routes

| Area | Base route |
|---|---|
| Buyers | `/api/auth` |
| Sellers | `/api/seller/auth` |
| Products | `/api/product` |
| Cart | `/api/cart` |
| Orders/payments | `/api/order` |
| Health check | `/api/health` |

## Payment Flow

1. The buyer adds available products to the cart.
2. Checkout asks the backend to calculate the cart total and create a Razorpay order.
3. Razorpay opens for the buyer.
4. The frontend sends the payment response to `/api/order/verify`.
5. The backend verifies the Razorpay signature before creating application orders and updating inventory.

## Security Notes

- Keep `JWT_SECRET`, Cloudinary credentials, Gmail app passwords, and Razorpay secrets outside source control.
- Rotate credentials immediately if they have been exposed.
- Buyer and seller routes enforce separate frontend guards and backend middleware.
- Public order tracking intentionally exposes only the order status and non-buyer details.
