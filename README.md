# Cartz
Ecommerce MERN app
# 🛒 MERN E-Commerce Platform

A full-stack **MERN-based E-Commerce Platform** designed to provide a complete online shopping experience with secure authentication, role-based access control, product management, cart and order management, online payments, image uploads, and an admin dashboard.

The project follows a modular architecture with separate frontend and backend layers and uses REST APIs for communication between them.

---

## 🚀 Features

### 👤 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Email verification
- OTP-based password reset
- Protected routes
- Role-Based Access Control (RBAC)
- Separate user and admin functionality
- Secure authorization middleware

---

### 🛍️ Product Management

- Browse available products
- Product details page
- Product image management
- Product creation and editing
- Product deletion
- Cloudinary integration for image storage
- Multer-based file handling
- Admin product management dashboard

---

### 🛒 Shopping Cart

- Add products to cart
- Remove products from cart
- Update product quantities
- Persistent cart functionality
- Cart data synchronized with backend
- Automatic cart total calculation

---

### 📦 Address Management

- Add delivery addresses
- Update addresses
- Delete addresses
- Select saved delivery address
- User-specific address management

---

### 💳 Online Payment Integration

Integrated **Razorpay** for secure online payments.

- Create Razorpay orders
- Payment checkout integration
- Payment success/failure handling
- Razorpay signature verification using HMAC SHA-256
- Order creation after successful payment
- Payment status management

---

### 📋 Order Management

#### User

- Place orders
- View order history
- View order details
- Track order/payment status

#### Admin

- View all orders
- Manage orders
- View order information
- Monitor paid orders
- Sales tracking

---

### 👨‍💼 Admin Dashboard

Dedicated admin functionality for managing the platform.

- Admin authentication
- Dashboard overview
- Product management
- User management
- Order management
- Sales analytics
- Total users count
- Total products count
- Total paid orders
- Total sales
- Sales data for the last 30 days
- Sales visualization using charts

---

### 📊 Sales Analytics

The backend uses **MongoDB aggregation pipelines** to generate sales statistics.

The dashboard provides:

- Total number of users
- Total number of products
- Total paid orders
- Total revenue
- Daily sales for the last 30 days
- Sales visualization using interactive charts

---

### 🖼️ Image Upload & Storage

- Image uploads using Multer
- Memory-based file handling
- Cloudinary integration
- Cloud-based product image storage
- Product image management from admin dashboard

---

### 🔄 State Management

Implemented **Redux Toolkit** for centralized frontend state management.

Redux is used for managing application-wide state such as:

- User authentication state
- Cart state
- Address state
- Selected address
- User-related data

---

### 🎨 Responsive UI

Built using:

- React
- Tailwind CSS
- Shadcn UI
- Lucide React icons

The interface includes:

- Responsive layouts
- Responsive product cards
- Mobile-friendly navigation
- Admin sidebar
- Responsive dashboard components
- Reusable UI components

---

## 🏗️ Tech Stack

### Frontend

- React.js
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS
- Shadcn UI
- Lucide React
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Cloudinary
- Nodemailer
- Crypto

### Payment

- Razorpay

### Database

- MongoDB Atlas

---

## 🧩 Major Backend Modules

The backend follows a modular structure with separate controllers, models, routes and middleware.

### Controllers

- User Controller
- Product Controller
- Cart Controller
- Order Controller
- Address Controller
- Session/Auth Controller
- Sales/Analytics Controller

### Models

- User
- Product
- Cart
- Order
- Address
- Session

### Middleware

- Authentication middleware
- Role-based authorization
- Request authentication
- Error handling

---

## 🔐 Security Features

The application implements several security mechanisms:

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Role-based authorization
- Bearer token authentication
- Email verification
- Razorpay payment signature verification
- User-specific data access

---

