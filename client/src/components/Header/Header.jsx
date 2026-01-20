import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaMobileAlt,
  FaCar,
  FaMotorcycle,
  FaCog,
  FaPlus,
  FaSignOutAlt,
  FaHeart,
  FaClipboardList,
  FaShoppingCart
} from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  const navItems = [
    {
      label: 'Used Cars',
      path: '/used-cars',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Search Used Cars', path: '/used-cars' },
        { label: 'Featured Cars', path: '/used-cars?featured=true' },
        { label: 'Certified Cars', path: '/used-cars?certified=true' }
      ]
    },
    {
      label: 'New Cars',
      path: '/new-cars',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Browse New Cars', path: '/new-cars' },
        { label: 'New Car Prices', path: '/new-cars/prices' },
        { label: 'Compare Cars', path: '/compare' }
      ]
    },
    {
      label: 'Auto Parts',
      path: '/parts',
      hasDropdown: false
    },
    {
      label: 'More',
      path: '#',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Car Dealers', path: '/dealers' },
        { label: 'Auto Financing', path: '/financing' },
        { label: 'Car Insurance', path: '/insurance' },
        { label: 'Admin Panel', path: '/admin' }
      ]
    },
    { label: 'Blog', path: '/blog', hasDropdown: false }
  ];

  const handleMouseEnter = (index) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    logout();
    setAccountDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      {/* Main Navigation */}
      <nav className="header-main">
        <div className="container header-main-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/logo.png" alt="CarZar" className="logo-image" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="nav-menu">
            {navItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${item.hasDropdown ? 'has-dropdown' : ''}`}
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link to={item.path} className="nav-link">
                  {item.label}
                  {item.hasDropdown && <FaChevronDown className="nav-dropdown-icon" />}
                </Link>
                {item.hasDropdown && activeDropdown === index && (
                  <div className="dropdown-menu">
                    {item.dropdownItems.map((dropItem, dropIndex) => (
                      <Link
                        key={dropIndex}
                        to={dropItem.path}
                        className="dropdown-item"
                      >
                        {dropItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Cart Icon */}
          <Link to="/cart" className="cart-icon-link">
            <FaShoppingCart />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>

          {/* Post Ad Button */}
          <Link to={isAuthenticated ? "/post-ad" : "/login"} className="btn btn-primary post-ad-btn">
            <FaPlus />
            <span>Post Free Ad</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        {/* Menu Header */}
        <div className="mobile-menu-header">
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <FaCar className="logo-icon" />
            <span className="logo-text">CarZar</span>
          </Link>
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Nav Links */}
        <ul className="mobile-nav-list">
          {navItems.map((item, index) => (
            <li key={index} className="mobile-nav-item">
              <Link
                to={item.path}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label === 'Used Cars' && <FaCar />}
                {item.label === 'New Cars' && <FaCar />}
                {item.label === 'Auto Parts' && <FaCog />}
                {item.label === 'More' && <FaBars />}
                {item.label}
              </Link>
            </li>
          ))}

          <div className="mobile-menu-divider" />

          {isAuthenticated && (
            <>
              <li className="mobile-nav-item">
                <Link to="/my-ads" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaClipboardList />
                  My Ads
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link to="/favorites" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaHeart />
                  Favorites
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaUser />
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Action Buttons */}
        <div className="mobile-menu-actions">
          <Link
            to={isAuthenticated ? "/post-ad" : "/login"}
            className="mobile-post-ad"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaPlus />
            <span>Post Free Ad</span>
          </Link>

          {isAuthenticated ? (
            <button
              className="mobile-logout"
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="mobile-logout"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaSignInAlt />
              <span>Sign In / Register</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
