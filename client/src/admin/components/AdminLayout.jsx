import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FaCar,
    FaCogs,
    FaUsers,
    FaChartBar,
    FaPlus,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaHome,
    FaLock,
    FaShoppingCart
} from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Check if user is admin - redirect to login if not (only after loading is complete)
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate('/admin-login');
            } else if (user?.role !== 'admin') {
                navigate('/admin-login');
            }
        }
    }, [isAuthenticated, user, navigate, loading]);

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Show access denied if not admin (after loading is complete)
    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="admin-access-denied">
                <FaLock className="lock-icon" />
                <h2>Admin Access Required</h2>
                <p>Please login with admin credentials to access this area.</p>
                <Link to="/admin-login" className="btn-login">
                    Go to Admin Login
                </Link>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/admin', icon: FaChartBar, label: 'Dashboard', exact: true },
        { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
        { path: '/admin/cars', icon: FaCar, label: 'Cars' },
        { path: '/admin/add-car', icon: FaPlus, label: 'Add Car' },
        { path: '/admin/parts', icon: FaCogs, label: 'Parts' },
        { path: '/admin/add-part', icon: FaPlus, label: 'Add Part' },
        { path: '/admin/users', icon: FaUsers, label: 'Users' }
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <Link to="/" className="admin-logo">
                        <FaCar className="logo-icon" />
                        <span className="logo-text">CarZar</span>
                    </Link>
                    <span className="admin-badge">Admin</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                        >
                            <item.icon className="nav-icon" />
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="nav-link">
                        <FaHome className="nav-icon" />
                        <span className="nav-label">Back to Site</span>
                    </Link>
                    <button className="nav-link logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt className="nav-icon" />
                        <span className="nav-label">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Bar */}
                <header className="admin-header">
                    <button
                        className="menu-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <div className="header-right">
                        <span className="admin-user">
                            Welcome, <strong>{user?.name || 'Yasir'}</strong>
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
