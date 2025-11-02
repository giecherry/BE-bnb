# BE-bnb: Backend for Hembnb Booking Platform

Welcome to the **Hembnb** backend! This project is a booking platform API built with **Hono**, **Supabase**, and **TypeScript**. It provides endpoints for managing users, properties, and bookings, with robust validation, role-based access control (RBAC), and security.

---

## **Features**
- **Authentication**: User login, registration, and session management.
- **Role-Based Access Control (RBAC)**: Admins, hosts, and users have specific permissions.
- **Property Management**: Hosts can create, update, and delete properties.
- **Booking Management**: Users can book properties and manage their bookings, and admins can manage bookings.
- **Validation**: All routes are validated using **Zod**.
- **Supabase Integration**: Database management with row-level security (RLS).

---

## **Getting Started**

### **Prerequisites**
- Node.js (v18 or higher)
- Supabase account and project
- Postman (optional, for testing)

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/giecherry/BE-bnb.git
   cd BE-bnb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```properties
     SUPABASE_URL=your-supabase-url
     SUPABASE_ANON_KEY=your-supabase-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
     HONO_PORT=your-port
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## **API Documentation**

### **Authentication Routes**
| Method | Endpoint         | Description                          | Access         |
|--------|-------------------|--------------------------------------|----------------|
| POST   | `/auth/login`     | Log in a user.                      | Public         |
| POST   | `/auth/register`  | Register a new user.                | Public         |
| POST   | `/auth/refresh`   | Refresh the user's session.         | Authenticated  |
| POST   | `/auth/logout`    | Log out the user.                   | Authenticated  |
| GET    | `/auth/me`        | Get the authenticated user's profile. | Authenticated  |

### **Properties Routes**
| Method | Endpoint              | Description                          | Access         |
|--------|------------------------|--------------------------------------|----------------|
| GET    | `/properties`          | Fetch all properties.               | Public         |
| GET    | `/properties/:id`      | Fetch a specific property by ID.    | Public         |
| POST   | `/properties`          | Create a new property.              | Host/Admin     |
| PATCH  | `/properties/:id`      | Update a property.                  | Host/Admin     |
| DELETE | `/properties/:id`      | Delete a property.                  | Host/Admin     |

### **Bookings Routes**
| Method | Endpoint                  | Description                          | Access         |
|--------|----------------------------|--------------------------------------|----------------|
| GET    | `/bookings`               | Fetch all bookings.                 | Admin          |
| GET    | `/bookings/:userId`       | Fetch bookings for a specific user. | Admin/User     |
| GET    | `/bookings/:id`           | Fetch a specific booking by ID.     | Admin/User/Host|
| POST   | `/bookings`               | Create a new booking.               | Authenticated  |
| PATCH  | `/bookings/:id`           | Update a booking.                   | Admin/User     |
| DELETE | `/bookings/:id`           | Delete a booking.                   | Admin/User     |

---

## **Reflections and Challenges**

### **1. Managing Supabase**
- **Challenge**: Writing and testing row-level security (RLS) policies.
- **Solution**: Clear policies like `"Allow users to see their bookings"` and `"Allow admins access to manage bookings"` ensured proper access control.

### **2. Validation**
- **Challenge**: Ensuring consistent validation across routes.
- **Solution**: Using **Zod** for schema validation helped enforce consistent rules.

### **3. Role-Based Access Control**
- **Challenge**: Implementing RBAC for different user roles (e.g., admin, host, user).
- **Solution**: The `requireRole` middleware simplified role checks.

### **4. Consistency in Routes**
- **Challenge**: Maintaining consistent patterns for CRUD operations.
- **Solution**: Following RESTful conventions and using validators for request payloads ensured consistency.

---
## **Future Improvements**

### **1. Add Search and Filtering for Bookings**
- **New Route**: `GET /bookings`
- **Description**: Allow admins to filter bookings by date range, user, or property.

### **2. Add a Route to Fetch a Property's Bookings**
- **New Route**: `GET /properties/:id/bookings`
- **Description**: Allow hosts to fetch all bookings for a specific property.

### **3. Add a Route for User Role Management**
- **New Route**: `PATCH /users/:id/role`
- **Description**: Allow admins to update a user's role.

---
