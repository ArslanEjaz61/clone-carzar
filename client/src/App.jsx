import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import OfferBanner from './components/OfferBanner/OfferBanner';

// Main Pages
import Home from './pages/Home';
import UsedCars from './pages/UsedCars';
import CarDetail from './pages/CarDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostAd from './pages/PostAd';
import MyAds from './pages/MyAds';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Parts from './pages/Parts';
import PartDetail from './pages/PartDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import { CartProvider } from './context/CartContext';

// Admin Pages
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import CarsList from './admin/pages/CarsList';
import AddCar from './admin/pages/AddCar';
import PartsList from './admin/pages/PartsList';
import AddPart from './admin/pages/AddPart';
import UsersList from './admin/pages/UsersList';
import OrdersList from './admin/pages/OrdersList';

import './index.css';
import './styles/responsive.css';

// Mobile Nav
import MobileNav from './components/MobileNav/MobileNav';
import ScrollToTop from './components/ScrollToTop';

// Layout component for pages with Header, Footer and Mobile Nav
const MainLayout = ({ children }) => (
  <>
    <OfferBanner />
    <Header />
    {children}
    <Footer />
    <MobileNav />
  </>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="app">
            <Routes>
              {/* Auth pages without header/footer */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Main Pages with header/footer */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />

              {/* Car Listings */}
              <Route path="/used-cars" element={<MainLayout><UsedCars condition="Used" /></MainLayout>} />
              <Route path="/new-cars" element={<MainLayout><UsedCars condition="New" /></MainLayout>} />
              <Route path="/parts" element={<MainLayout><Parts /></MainLayout>} />

              {/* Car Details */}
              <Route path="/car/:id" element={<MainLayout><CarDetail /></MainLayout>} />

              {/* Part Details */}
              <Route path="/parts/:id" element={<MainLayout><PartDetail /></MainLayout>} />

              {/* User Dashboard */}
              <Route path="/post-ad" element={<MainLayout><PostAd /></MainLayout>} />
              <Route path="/my-ads" element={<MainLayout><MyAds /></MainLayout>} />
              <Route path="/favorites" element={<MainLayout><Favorites /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
              <Route path="/track" element={<MainLayout><TrackOrder /></MainLayout>} />
              <Route path="/track/:orderNumber" element={<MainLayout><TrackOrder /></MainLayout>} />

              {/* Placeholder Routes */}
              <Route path="/dealers" element={<MainLayout><UsedCars /></MainLayout>} />
              <Route path="/about" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/terms" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/privacy" element={<MainLayout><Home /></MainLayout>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="cars" element={<CarsList />} />
                <Route path="add-car" element={<AddCar />} />
                <Route path="parts" element={<PartsList />} />
                <Route path="add-part" element={<AddPart />} />
                <Route path="users" element={<UsersList />} />
                <Route path="orders" element={<OrdersList />} />
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<MainLayout><Home /></MainLayout>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
