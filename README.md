# CarZar - Car Marketplace Clone

A full-stack car marketplace clone built with MERN stack (MongoDB, Express, React, Node.js).

![CarZar](https://img.shields.io/badge/CarZar-Car%20Marketplace-orange)
![MERN](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Development-blue)

## 🚗 Features

### Frontend (React + Vite)
- Modern, responsive UI with premium design
- Homepage with hero section, search filters, and featured cars
- Car listing page with advanced filters (make, model, price, year, etc.)
- Car detail page with image gallery and seller contact
- User authentication (Login/Signup)
- Post ad functionality with multi-step form
- Mobile-responsive design
- Demo mode (works without backend)

### Backend (Node.js + Express)
- RESTful API
- MongoDB database with Mongoose ODM
- User authentication with JWT
- Car CRUD operations
- Advanced search and filtering
- Pagination support

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- React Router DOM
- Axios
- React Icons
- React Slick (Carousel)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## 📁 Project Structure

```
clone-carzar/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Hero/
│   │   │   ├── CarCard/
│   │   │   ├── FeaturedCars/
│   │   │   ├── BrowseSection/
│   │   │   └── SearchFilters/
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── UsedCars.jsx
│   │   │   ├── CarDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── PostAd.jsx
│   │   ├── context/        # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/       # API Services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── server/                 # Node.js Backend
    ├── models/
    │   ├── User.js
    │   └── Car.js
    ├── routes/
    │   ├── auth.js
    │   ├── cars.js
    │   └── users.js
    ├── index.js
    ├── .env
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas) - Optional, demo mode works without it
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "clone carzar"
```

2. **Install frontend dependencies**
```bash
cd client
npm install
```

3. **Install backend dependencies**
```bash
cd ../server
npm install
```

4. **Set up environment variables (Optional)**
Create a `.env` file in the server folder:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/carzar
JWT_SECRET=your_secret_key
```

5. **Start the development servers**

**Frontend (Terminal 1):**
```bash
cd client
npm run dev
```

**Backend (Terminal 2) - Optional:**
```bash
cd server
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🎨 Demo Mode

The application works without a backend! Use the **"Demo Login"** button on the login page to access all features with sample data.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Cars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cars` | Get all cars (with filters) |
| GET | `/api/cars/featured` | Get featured cars |
| GET | `/api/cars/:id` | Get single car |
| POST | `/api/cars` | Create new listing |
| PUT | `/api/cars/:id` | Update listing |
| DELETE | `/api/cars/:id` | Delete listing |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update profile |
| GET | `/api/users/:id/listings` | Get user's listings |
| GET | `/api/users/:id/favorites` | Get favorites |
| POST | `/api/users/:id/favorites/:carId` | Add to favorites |
| DELETE | `/api/users/:id/favorites/:carId` | Remove from favorites |

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Navy | `#00305B` | Header, Footer |
| Navy Dark | `#002244` | Dark backgrounds |
| Accent Orange | `#E98135` | Buttons, CTAs, Highlights |
| White | `#FFFFFF` | Backgrounds |
| Gray 50 | `#f9fafb` | Light backgrounds |

## 📱 Pages & Features

### Homepage
- Modern hero section with tabbed search
- Featured cars carousel
- Browse by category, make, city
- Why Choose CarZar section
- Download App section

### Search Results
- Sidebar filters (make, model, price, year, city)
- Grid/List view toggle
- Sorting options
- Pagination

### Car Detail
- Image gallery with thumbnails
- Detailed specifications
- Seller contact card (Show Phone, WhatsApp)
- Share & Favorite buttons

### Authentication
- Login with email/password
- Registration form
- Demo login for testing
- Social login buttons (UI only)

### Post Ad
- Multi-step form
- Image upload with preview
- Form validation
- Success confirmation

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

**Backend:**
```bash
npm run start    # Start server
npm run dev      # Start with hot reload
```

## 📄 License

This project is for educational purposes only.

## 👤 Author

Arslan Malik

---

Made with ❤️ using MERN Stack
