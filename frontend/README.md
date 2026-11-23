# FasalBazar Frontend

This is the React and Vite frontend for FasalBazar.

## Setup

Create `.env`:

```dotenv
VITE_BASE_URL=http://localhost:3000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

Install and run:

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Redux state is divided by account and domain under `src/redux`. Buyer and seller pages use separate route guards from `src/auth/ProtectedRoutes.jsx`.
