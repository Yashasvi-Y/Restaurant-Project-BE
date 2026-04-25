# Restaurant Project - Backend

A comprehensive Node.js/Express backend for a restaurant booking and review management system with admin dashboard, role-based access control, and email notifications.

## 🌟 Features

### Core Functionality

- **User Authentication**: Email OTP verification + JWT token-based authentication
- **Booking Management**: Create, view, update, and cancel reservations with automatic status transitions
- **Review System**: Submit, approve/reject reviews with admin moderation
- **Admin Dashboard**: Complete management of bookings, reviews, menu items, and staff
- **Contact/Support**: Customer support message handling with admin responses
- **Menu Management**: Dynamic menu items with filtering and categorization
- **Staff Showcase**: Staff member profiles with admin management

### Security & Access Control

- **Role-Based Access Control (RBAC)**: Admin-only routes with middleware authentication
- **JWT Authentication**: Secure token-based authorization
- **Password Security**: Bcrypt hashing for stored passwords
- **Admin Middleware**: Protected endpoints for administrative operations

### Automation

- **Auto-completion**: Bookings automatically marked as completed 120+ minutes after reservation time
- **Email Notifications**: Support for transactional emails (configured for Brevo)
- **MongoDB Connection Management**: Automatic reconnection logic with retry intervals
- **Cancellation Tracking**: Records who cancelled bookings and when

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email**: Brevo (formerly Sendinblue) integration
- **Deployment**: Render

## 🔐 Authentication Flow

1. **Registration**: Users provide email, name, password → OTP sent to email
2. **Email Verification**: User verifies OTP → Account created
3. **Login**: Email + password → JWT token issued
4. **Protected Routes**: JWT token in `Authorization: Bearer <token>` header
5. **Admin Routes**: User must have `role: 'admin'` in token

## 🔗 Related Repository

Frontend: [Restaurant-Project](https://github.com/Yashasvi-Y/Restaurant-Project)

---

**Made by Yashasvi**
