import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaCar, FaBars, FaTimes, FaCog, FaPlus, FaTools, FaCarSide, FaCarAlt, FaUser, FaHeart, FaClipboardList, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './MobileNav.css';

const MobileNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [buyMenuOpen, setBuyMenuOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const [searchMenuOpen, setSearchMenuOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const handleBuyClick = () => {
        setBuyMenuOpen(!buyMenuOpen);
        setMoreMenuOpen(false);
        setSearchMenuOpen(false);
    };

    const handleMoreClick = () => {
        setMoreMenuOpen(!moreMenuOpen);
        setBuyMenuOpen(false);
        setSearchMenuOpen(false);
    };

    const handleSearchClick = () => {
        setSearchMenuOpen(!searchMenuOpen);
        setBuyMenuOpen(false);
        setMoreMenuOpen(false);
    };

    const handleOptionClick = (path) => {
        setBuyMenuOpen(false);
        setMoreMenuOpen(false);
        setSearchMenuOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        setMoreMenuOpen(false);
        navigate('/');
    };

    const closeMenues = () => {
        setBuyMenuOpen(false);
        setMoreMenuOpen(false);
        setSearchMenuOpen(false);
    };

    return (
        <>
            {/* Overlay */}
            {(buyMenuOpen || moreMenuOpen || searchMenuOpen) && (
                <div className="mobile-nav-overlay" onClick={closeMenues} />
            )}

            {/* Search Options Popup */}
            <div className={`search-options-popup ${searchMenuOpen ? 'active' : ''}`}>
                <button
                    className="search-option"
                    onClick={() => handleOptionClick('/used-cars')}
                    style={{ animationDelay: '0ms' }}
                >
                    <div className="search-option-icon">
                        <FaCarSide />
                    </div>
                    <span>Search Used Cars</span>
                </button>
                <button
                    className="search-option"
                    onClick={() => handleOptionClick('/new-cars')}
                    style={{ animationDelay: '50ms' }}
                >
                    <div className="search-option-icon">
                        <FaCarAlt />
                    </div>
                    <span>Search New Cars</span>
                </button>
                <button
                    className="search-option"
                    onClick={() => handleOptionClick('/parts')}
                    style={{ animationDelay: '100ms' }}
                >
                    <div className="search-option-icon">
                        <FaTools />
                    </div>
                    <span>Search Auto Parts</span>
                </button>
            </div>

            {/* Buy Options Popup */}
            <div className={`buy-options-popup ${buyMenuOpen ? 'active' : ''}`}>
                <button
                    className="buy-option"
                    onClick={() => handleOptionClick('/parts')}
                    style={{ animationDelay: '0ms' }}
                >
                    <div className="buy-option-icon auto-parts">
                        <FaTools />
                    </div>
                    <span>Auto Parts</span>
                </button>
                <button
                    className="buy-option"
                    onClick={() => handleOptionClick('/used-cars')}
                    style={{ animationDelay: '50ms' }}
                >
                    <div className="buy-option-icon used-cars">
                        <FaCarSide />
                    </div>
                    <span>Used Cars</span>
                </button>
                <button
                    className="buy-option"
                    onClick={() => handleOptionClick('/new-cars')}
                    style={{ animationDelay: '100ms' }}
                >
                    <div className="buy-option-icon new-cars">
                        <FaCarAlt />
                    </div>
                    <span>New Cars</span>
                </button>
            </div>

            {/* More Options Popup */}
            <div className={`more-options-popup ${moreMenuOpen ? 'active' : ''}`}>
                {isAuthenticated ? (
                    <>
                        <button className="more-option" onClick={() => handleOptionClick('/profile')}>
                            <FaUser />
                            <span>Profile</span>
                        </button>
                        <button className="more-option" onClick={() => handleOptionClick('/favorites')}>
                            <FaHeart />
                            <span>Favorites</span>
                        </button>
                        <button className="more-option" onClick={() => handleOptionClick('/my-ads')}>
                            <FaClipboardList />
                            <span>My Ads</span>
                        </button>
                        <button className="more-option logout" onClick={handleLogout}>
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button className="more-option" onClick={() => handleOptionClick('/login')}>
                            <FaSignInAlt />
                            <span>Login</span>
                        </button>
                        <button className="more-option" onClick={() => handleOptionClick('/signup')}>
                            <FaUser />
                            <span>Sign Up</span>
                        </button>
                    </>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="mobile-bottom-nav">
                <Link
                    to="/"
                    className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
                    onClick={closeMenues}
                >
                    <FaHome className="nav-icon" />
                    <span className="nav-label">Home</span>
                </Link>

                <button
                    className={`mobile-nav-item ${searchMenuOpen ? 'active' : ''}`}
                    onClick={handleSearchClick}
                >
                    <FaSearch className="nav-icon" />
                    <span className="nav-label">Search</span>
                </button>

                <button
                    className={`mobile-nav-item main-btn ${buyMenuOpen ? 'active' : ''}`}
                    onClick={handleBuyClick}
                >
                    <div className="main-btn-circle">
                        {buyMenuOpen ? (
                            <FaTimes className="plus-icon" />
                        ) : (
                            <FaPlus className="plus-icon" />
                        )}
                    </div>
                    <span className="main-label">Buy</span>
                </button>

                <Link
                    to="/new-cars"
                    className={`mobile-nav-item ${isActive('/new-cars') ? 'active' : ''}`}
                    onClick={closeMenues}
                >
                    <FaCar className="nav-icon" />
                    <span className="nav-label">New Cars</span>
                </Link>

                <button
                    className={`mobile-nav-item ${moreMenuOpen ? 'active' : ''}`}
                    onClick={handleMoreClick}
                >
                    <FaBars className="nav-icon" />
                    <span className="nav-label">More</span>
                </button>
            </nav>
        </>
    );
};

export default MobileNav;
