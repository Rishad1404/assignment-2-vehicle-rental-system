# Assignment-2-Vehicle-Rental-System

**Live URL:** [https://assignment-2-vehicle-rental-system.vercel.app/](#)

---

## Features

- Role-based access: Admin and Customer.
- Book vehicles with start and end dates.
- View all bookings (Admin) or own bookings (Customer).
- Cancel or return bookings with automatic vehicle availability updates.
- Auto-mark bookings as returned when the rental period ends.
- Prevent deletion of users or vehicles with active bookings.
- Secure authentication using JWT.

---

## Technology Stack


- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment Management:** dotenv
- **API Testing:** Postman or any REST client

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Rishad1404/assignment-2-vehicle-rental-system.git
cd assignment-2-vehicle-rental-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
```bash
create a .env file with the required variables
PORT
CONNECTION_STR
JWT_SECRET
```

### 4. Database Setup
```
1. Ensure PostgreSQL is running
2. Create the required tables
3. The tables will automatically be created in NeonDB, which I used as a database.
```

### 5. Start the Server
```bash
npm run dev

The server should now run at http://localhost:PORT
```


## API Endpoints Overview

### 1. Authentication
```POSTMAN
1. POST /api/v1/auth/signup – Sign up as admin or customer
2. POST /api/v1/auth/signin – Sign in to receive a JWT token
```

### 2. Users
```POSTMAN
1. GET /api/v1/users – Retrieve all users (Admin only)
2. GET /api/v1/users/:userId – Retrieve a specific user by ID (Admin only)
3. PUT /api/v1/users/:userId – Update user details (Admin only)
4. DELETE /api/v1/users/:userId – Delete a user if no active bookings (Admin only
```

### 3. Vehicles
```POSTMAN
1. POST /api/v1/vehicles – Add a new vehicle (Admin only)
2. GET /api/v1/vehicles – List all vehicles
3. GET /api/v1/vehicles/:vehicleId – Get vehicle details
4. PUT /api/v1/vehicles/:vehicleId – Update vehicle details (Admin only)
5. DELETE /api/v1/vehicles/:vehicleId – Delete a vehicle if no active bookings (Admin only)
```

### 3. Bookings
```POSTMAN
1. POST /api/v1/bookings – Create a new booking (Customer/Admin)
2. GET /api/v1/bookings – Retrieve bookings
   - Admin: View all bookings
   - Customer: View own bookings
3. PUT /api/v1/bookings/:bookingId – Update booking status
   - Customer: Cancel booking before start date
   - Admin: Mark booking as returned
4. DELETE /api/v1/bookings/:bookingId – Delete a booking (Admin only, optional)
```


