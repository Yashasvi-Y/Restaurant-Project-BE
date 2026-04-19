/\*\*

- RESTAURANT PROJECT - RBAC (Role-Based Access Control) DOCUMENTATION
-
- This document defines the minimal RBAC required for the restaurant project.
- ===========================================================================
  \*/

// ============================================================================
// 1. ROLES DEFINED
// ============================================================================

/\*\*

- CUSTOMER (default role)
- - Can browse menu, items, staff directory
- - Can make bookings for dine-in
- - Can leave reviews after visiting
- - Can view their own bookings and reviews
- - Cannot access admin features
    \*/
    const CUSTOMER_ROLE = 'customer';

/\*\*

- ADMIN
- - Can manage all bookings (view, edit, cancel, confirm)
- - Can manage menu items (CRUD operations)
- - Can manage staff profiles (CRUD operations)
- - Can moderate reviews (approve/reject)
- - Can view admin dashboard with KPIs and analytics
- - Can manage contact/support messages
- - Full system access
    \*/
    const ADMIN_ROLE = 'admin';

// ============================================================================
// 2. PROTECTED ROUTES (Implemented with RBAC)
// ============================================================================

/\*\*

- Authentication Required (authMiddleware)
- User must be logged in, but role doesn't matter
  \*/
  const AUTH_REQUIRED = [
  'POST /api/bookings', // Create booking
  'GET /api/bookings', // Get user's own bookings
  'POST /api/reviews', // Create review
  'GET /api/reviews/:id' // Get review details
  ];

/\*\*

- Admin Only (adminMiddleware)
- Only users with role === 'admin' can access
  \*/
  const ADMIN_ONLY = [
  // Bookings Management
  'GET /api/bookings/admin/all', // View all bookings (admin)
  'PUT /api/bookings/:id', // Update booking (admin)
  'DELETE /api/bookings/:id', // Cancel booking (admin)

// Menu Management
'POST /api/menu', // Create menu item (admin)
'PUT /api/menu/:id', // Update menu item (admin)
'DELETE /api/menu/:id', // Delete menu item (admin)

// Staff Management
'POST /api/staff', // Create staff (admin)
'PUT /api/staff/:id', // Update staff (admin)
'DELETE /api/staff/:id', // Delete staff (admin)

// Review Moderation
'GET /api/reviews/admin/pending', // Get pending reviews (admin)
'PUT /api/reviews/:id/approve', // Approve review (admin)
'DELETE /api/reviews/:id', // Delete review (admin)

// Dashboard
'GET /api/admin/dashboard', // Get admin dashboard stats
'GET /api/admin/stats', // Get KPIs

// Contact Management (Future)
'GET /api/contact', // View all contacts (admin)
'PUT /api/contact/:id', // Update contact status (admin)
];

/\*\*

- Public Routes (No Authentication)
- Anyone can access
  \*/
  const PUBLIC_ROUTES = [
  'GET /api/menu', // Browse menu
  'GET /api/menu/:id', // View menu item
  'GET /api/staff', // View staff directory
  'GET /api/staff/:id', // View staff profile
  'GET /api/reviews/public', // View approved reviews
  'POST /api/auth/send-otp', // Send OTP
  'POST /api/auth/verify-otp', // Verify OTP & register
  'POST /api/auth/login', // Login
  ];

// ============================================================================
// 3. IMPLEMENTATION IN CODE
// ============================================================================

/\*\*

- Example: Admin-Only Route
-
- router.put('/api/menu/:id', authMiddleware, adminMiddleware, menuController.updateItem);
-                              └─────────────┘  └──────────────┘
-                              Check logged in  Check role===admin
  \*/

/\*\*

- Example: Auth Required Route
-
- router.post('/api/bookings', authMiddleware, bookingController.createBooking);
-                               └─────────────┘
-                               Check logged in (any role)
  \*/

/\*\*

- Example: Public Route
-
- router.get('/api/menu', menuController.getMenu);
- (No middleware)
  \*/

// ============================================================================
// 4. USER MODEL
// ============================================================================

/\*\*

- Current role enum in User.js:
-
- role: {
- type: String,
- enum: ['customer', 'admin'], // Only 2 roles
- default: 'customer'
- }
  \*/

// ============================================================================
// 5. AUTHORIZATION CHECKS (in middleware/auth.js)
// ============================================================================

/\*\*

- authMiddleware
- - Extracts JWT token from Authorization header
- - Verifies token with JWT_SECRET
- - Sets req.user with decoded payload (id, email, role, etc.)
- - Returns 401 if token missing or invalid
    \*/

/\*\*

- adminMiddleware
- - Checks if req.user.role === 'admin'
- - Returns 403 Forbidden if not admin
- - Must be called AFTER authMiddleware
    \*/

// ============================================================================
// 6. DATABASE USERS
// ============================================================================

/\*\*

- Current users in database:
-
- 1.  admin@test.com
- - role: 'admin'
- - Can access admin dashboard
-
- 2.  yashi83yadav@gmail.com
- - role: 'customer' (default)
- - Can make bookings and reviews
    \*/

// ============================================================================
// 7. FUTURE ENHANCEMENTS
// ============================================================================

/\*\*

- When adding more roles in future:
-
- STAFF Role (optional):
- - View own schedule
- - Update own availability
- - View orders for their shift
-
- How to add:
- 1.  Update User model role enum: ['customer', 'admin', 'staff']
- 2.  Create staffMiddleware in auth.js
- 3.  Add routes that require staffMiddleware
      \*/

// ============================================================================
// 8. SECURITY CHECKLIST
// ============================================================================

/\*\*

- ✅ DONE:
- - JWT-based authentication (token in localStorage)
- - Role-based authorization (customer vs admin)
- - Admin middleware on all protected routes
- - Passwords hashed with bcryptjs
- - CORS enabled for frontend only
-
- ⚠️ TODO (Future):
- - Add request rate limiting
- - Add logging for admin actions (audit trail)
- - Add HTTPS in production
- - Add refresh token rotation
- - Add 2FA for admin accounts
    \*/

// ============================================================================
// 9. TESTING RBAC
// ============================================================================

/\*\*

- Test Admin-Only Route:
-
- 1.  Login as admin:
- POST /api/auth/login
- Body: { email: "admin@test.com", password: "..." }
- Response: { token: "jwt_token", user: { role: "admin" } }
-
- 2.  Use token to access admin route:
- GET /api/admin/dashboard
- Headers: { Authorization: "Bearer jwt_token" }
- Response: { success: true, dashboard: {...} }
-
- 3.  Test with customer token - should get 403:
- Headers: { Authorization: "Bearer customer_jwt_token" }
- Response: { message: "Admin access required" }
  \*/

module.exports = {
CUSTOMER_ROLE,
ADMIN_ROLE,
AUTH_REQUIRED,
ADMIN_ONLY,
PUBLIC_ROUTES
};
