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

## Environment Variables

Create `backend/.env` and configure at least:

- `MONGO_URI` (optional for local setup; defaults to `mongodb://localhost:27017/fasalbazar`. Set this explicitly when using a remote/managed MongoDB instance or production database.)
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
- CORS is currently configured to allow all origins in backend. Restrict allowed origins before deploying to production.
