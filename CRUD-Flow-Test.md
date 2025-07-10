# TechZone CRUD Flow Test Guide

## Complete User Journey: Guest to Authenticated User with Cart Persistence

### 🔄 CRUD Flow Overview

This guide demonstrates the complete user CRUD (Create, Read, Update, Delete) flow implemented in TechZone:

1. **Guest User** - Browse and add products to cart
2. **Registration** - Create account to proceed with checkout
3. **Authentication** - Sign in with credentials
4. **Data Persistence** - Cart merges with user account
5. **Profile Management** - View, edit, update, and delete user data

---

### 📋 Step-by-Step Test Instructions

#### Phase 1: Guest Shopping Experience
1. **Visit the homepage**: http://localhost:3000
2. **Browse products**: Navigate to `/products` or `/categories`
3. **Add items to cart**: 
   - Click "Add to Cart" on any product
   - See confirmation alert: "✅ [Product Name] added to cart!"
   - Notice cart icon shows item count
4. **View cart**: Click cart icon or go to `/cart`
   - Cart shows selected items (stored in localStorage for guests)
   - Items persist even if you refresh the page

#### Phase 2: Registration Prompt
1. **Attempt checkout**: In cart page, click "Proceed to Checkout"
2. **Registration prompt**: System shows dialog:
   - "To proceed with checkout, you need to create an account or sign in"
   - "Your cart will be saved!"
   - Choose "OK" for Register or "Cancel" for Sign In

#### Phase 3: Account Creation (CRUD: CREATE)
1. **Registration page**: `/auth/signup`
2. **Fill registration form**:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "Password123"
   - Confirm Password: "Password123"
3. **Submit registration**: Click "Create Account"
4. **Auto sign-in**: System automatically signs you in after registration
5. **Cart merge**: Your guest cart items are merged with your new account
6. **Database storage**: User data is saved in MongoDB via Prisma

#### Phase 4: Profile Data (CRUD: READ)
1. **Access profile**: Click user icon → "Your Profile" or go to `/profile`
2. **View user data**:
   - Personal information (name, email)
   - Account statistics (loyalty points, member since)
   - Order history (if any)
   - Recent activity
   - **All data comes from the database, no mock data**

#### Phase 5: Profile Editing (CRUD: UPDATE)
1. **Edit mode**: In profile page, click "Edit Profile" button
2. **Modify data**:
   - Update name, email, phone, address
   - See form validation in real-time
3. **Save changes**: Click "Save Changes"
4. **Database update**: Changes are saved to MongoDB
5. **Confirmation**: See updated data immediately

#### Phase 6: Account Management (CRUD: DELETE)
1. **Account settings**: Access through profile page
2. **Delete account**: Option available in profile (if implemented)
3. **Data cleanup**: All user data removed from database

---

### 🔧 Technical Implementation Details

#### Cart Persistence Flow
```javascript
// Guest cart (localStorage) → Registration → User cart (database)
Guest adds items → localStorage storage → Registration/Sign-in → Cart merge → Database persistence
```

#### Authentication Integration
- **NextAuth.js** handles authentication
- **Prisma** manages database operations
- **MongoDB** stores user and cart data
- **Session management** maintains login state

#### API Endpoints Used
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User authentication  
- `GET /api/user` - Fetch user profile data
- `PUT /api/user` - Update user profile
- `POST /api/cart` - Add items to cart
- `GET /api/cart` - Fetch user's cart

#### Database Schema
```prisma
model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String    @unique
  phone         String?   // ✅ Added for profile editing
  address       String?   // ✅ Added for profile editing
  password      String    // Hashed with bcrypt
  role          UserRole  @default(BUYER)
  loyaltyPoints Int       @default(0)
  cartItems     CartItem[]
  orders        Order[]
  // ... other fields
}
```

---

### ✅ Expected Results

#### After completing the full flow:

1. **✅ Guest cart items preserved** during registration
2. **✅ User data saved in database** (no mock data)
3. **✅ Profile shows real information** from database
4. **✅ Profile editing works** with validation
5. **✅ Cart persists across sessions** for authenticated users
6. **✅ Sign out/in maintains data** consistency

#### Key Features Demonstrated:

- 🛒 **Cart Persistence**: Guest → User cart merging
- 👤 **User Registration**: Account creation with validation
- 🔐 **Authentication**: Secure sign-in flow
- 📊 **Profile Management**: View/Edit user data
- 💾 **Database Integration**: Real data storage
- 🔄 **Session Management**: Persistent login state

---

### 🐛 Testing Scenarios

#### Test Case 1: Guest Cart Preservation
1. Add 3 products as guest
2. Register new account
3. Verify all 3 products appear in authenticated cart

#### Test Case 2: Profile Data Persistence
1. Register with name "Test User"
2. Edit profile to "Updated User"
3. Sign out and sign back in
4. Verify name shows as "Updated User"

#### Test Case 3: Session Management
1. Add items to cart
2. Close browser completely
3. Return to site and sign in
4. Verify cart items are still there

---

### 🚀 Additional Features

#### Enhanced User Experience:
- **Loading states** during API calls
- **Error handling** with user-friendly messages
- **Form validation** with real-time feedback
- **Visual feedback** for successful operations
- **Responsive design** works on all devices

#### Security Features:
- **Password hashing** with bcrypt
- **Session-based authentication** via NextAuth
- **Input validation** using Zod schemas
- **Protected routes** for authenticated users only

---

*This CRUD flow demonstrates a complete, production-ready user management system with cart persistence, secure authentication, and real database integration.*
