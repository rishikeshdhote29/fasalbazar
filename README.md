# 🌾 FasalBazar

FasalBazar is a full-stack agricultural e-commerce marketplace designed to connect **farmers/sellers with buyers**. The platform provides separate workflows for buyers and sellers, allowing sellers to manage products and buyers to browse, purchase, and track orders.

## 🚀 Features

### 👤 Buyer Features

- User registration and login
- Browse agricultural products
- Search and explore products
- Add products to cart
- Manage shopping cart
- Place orders
- View order history
- Track order status
- Manage user profile

### 🌾 Seller / Farmer Features

- Seller registration and login
- Seller profile management
- Add new products
- Update product information
- Delete products
- Manage listed products
- View and manage customer orders

### 🔐 Authentication & Security

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Separate buyer and seller workflows
- Secure password hashing
- Forgot password functionality
- Email-based password reset

### 🛒 E-Commerce

- Product catalog
- Product details
- Shopping cart
- Order processing
- Order management
- Buyer and seller workflows

### 🖼️ Image Management

- Product image uploads
- Cloudinary integration
- Multer for handling file uploads

### 💳 Payment

- Stripe payment integration

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Redux Toolkit
- JavaScript
- Tailwind CSS
- Bootstrap
- Axios

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- Bcrypt

### Database

- MongoDB
- Mongoose

### Third-Party Services

- Cloudinary
- Stripe
- Nodemailer

### Tools

- Git
- GitHub
- Postman

---

## 🏗️ Project Structure

```text
FasalBazar/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── redux/
│   │   ├── pages/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── models/
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── config/
    └── server.js
⚙️ Installation
1. Clone Repository
git clone https://github.com/rishikeshdhote29/fasalbazar.git
cd fasalbazar
2. Backend Setup
cd backend
npm install

Create a .env file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

Start the backend:

npm run dev
3. Frontend Setup

Open another terminal:

cd frontend
npm install
npm run dev

The application will run locally using the Vite development server.
