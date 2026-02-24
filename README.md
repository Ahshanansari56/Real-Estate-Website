# 🏠 Estate Luxe — MERN Stack Real Estate System

A production-ready full-stack real estate platform built with MongoDB, Express, React, and Node.js.

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6, Axios    |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT (JSON Web Tokens)               |
| Styling    | Custom CSS (Luxury Dark Gold theme) |
| Toasts     | react-hot-toast                     |

---

## 📁 Project Structure

```
real-estate/
├── backend/
│   ├── server.js              # Entry point
│   ├── .env                   # Environment variables
│   ├── models/
│   │   ├── User.js
│   │   ├── RealEstate.js
│   │   ├── Report.js
│   │   └── Settings.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── realEstateController.js
│   │   ├── userController.js
│   │   ├── reportController.js
│   │   └── settingsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── realEstateRoutes.js
│   │   ├── userRoutes.js
│   │   ├── reportRoutes.js
│   │   └── settingsRoutes.js
│   └── middleware/
│       └── auth.js             # JWT + Role middleware
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css           # Global styles
        ├── context/AuthContext.js
        ├── utils/api.js
        ├── components/
        │   ├── layout/Navbar.js
        │   ├── layout/Footer.js
        │   └── common/PropertyCard.js
        └── pages/
            ├── Home.js
            ├── Properties.js
            ├── PropertyDetail.js
            ├── Login.js
            ├── Register.js
            ├── Dashboard.js
            ├── AddProperty.js
            ├── EditProperty.js
            ├── Profile.js
            ├── NotFound.js
            └── admin/
                ├── AdminUsers.js
                ├── AdminReports.js
                └── AdminSettings.js
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Setup Backend

```bash
cd backend
npm install
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/real_estate_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev     # Development (nodemon)
npm start       # Production
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm start
```

App runs at **http://localhost:3000**

---

## 🔐 JWT Authentication Flow

```
1. User registers → password hashed (bcrypt) → saved to MongoDB
2. User logs in → server verifies password → generates JWT token
3. Token stored in localStorage
4. Token sent in Authorization: Bearer <token> header
5. Backend middleware verifies token and user role
6. Valid → allow access | Invalid → 401 Unauthorized
```

---

## 📡 REST API Reference

### Auth
| Method | Endpoint                   | Access  | Description        |
|--------|----------------------------|---------|--------------------|
| POST   | /api/auth/register         | Public  | Register user      |
| POST   | /api/auth/login            | Public  | Login + get token  |
| GET    | /api/auth/me               | Private | Get current user   |
| PUT    | /api/auth/profile          | Private | Update profile     |
| PUT    | /api/auth/change-password  | Private | Change password    |

### Real Estate (CRUD)
| Method | Endpoint            | Access         | Description          |
|--------|---------------------|----------------|----------------------|
| POST   | /api/real           | Private        | Create property      |
| GET    | /api/real           | Public         | Get all properties   |
| GET    | /api/real/:id       | Public         | Get single property  |
| PUT    | /api/real/:id       | Private        | Update property      |
| DELETE | /api/real/:id       | Private        | Delete property      |
| GET    | /api/real/my        | Private        | My listings          |
| GET    | /api/real/stats     | Admin only     | Dashboard stats      |

### Users (Admin)
| Method | Endpoint                  | Access     |
|--------|---------------------------|------------|
| GET    | /api/users                | Admin only |
| GET    | /api/users/:id            | Admin only |
| PUT    | /api/users/:id            | Admin only |
| DELETE | /api/users/:id            | Admin only |
| PATCH  | /api/users/:id/toggle     | Admin only |

### Reports (Admin)
| Method | Endpoint         | Access     |
|--------|------------------|------------|
| POST   | /api/reports     | Admin only |
| GET    | /api/reports     | Admin only |
| DELETE | /api/reports/:id | Admin only |

### Settings (Admin)
| Method | Endpoint               | Access     |
|--------|------------------------|------------|
| GET    | /api/settings          | Private    |
| POST   | /api/settings          | Admin only |
| POST   | /api/settings/bulk     | Admin only |
| DELETE | /api/settings/:key     | Admin only |

---

## 🔍 Query Filters (GET /api/real)

```
?search=bandra
?type=apartment|house|villa|office|land|commercial
?status=for-sale|for-rent|sold|rented
?city=Mumbai
?minPrice=1000000
?maxPrice=50000000
?bedrooms=3
?featured=true
?sort=-createdAt|price|-price|-views
?page=1&limit=12
```

---

## 👥 Default Demo Users

Create these manually via the register endpoint or seed script:

| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@estate.com    | admin123 |
| User  | user@estate.com     | user123  |

To create admin, register normally then update role in MongoDB:
```js
db.users.updateOne({ email: "admin@estate.com" }, { $set: { role: "admin" } })
```

---

## 🎨 Features

- ✅ Full CRUD for Properties
- ✅ JWT Authentication + Role-based Access Control
- ✅ Admin Panel (Users, Reports, Settings)
- ✅ Advanced Property Filtering & Pagination
- ✅ Featured Properties & Property Types
- ✅ Image Gallery on Property Detail
- ✅ Agent Contact Info
- ✅ User Dashboard with My Listings
- ✅ Responsive Design
- ✅ Luxury Dark Gold Aesthetic
- ✅ Toast Notifications

---

## 🌐 Deployment

### Backend (Railway / Render / VPS)
1. Set environment variables on your platform
2. Use `npm start`

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL` or update proxy in package.json
2. Run `npm run build`
3. Deploy the `build/` directory

### MongoDB
Use MongoDB Atlas (free tier available at atlas.mongodb.com)
