import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaCogs, FaUsers, FaStar, FaPlus, FaArrowRight } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCars: 0,
        totalParts: 0,
        newCars: 0,
        usedCars: 0,
        featuredCars: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminAPI.getStats();
            if (response.data?.data) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.log('Using demo stats');
            // Demo stats
            setStats({
                totalUsers: 125,
                totalCars: 48,
                totalParts: 32,
                newCars: 12,
                usedCars: 36,
                featuredCars: 8
            });
        }
        setLoading(false);
    };

    const statCards = [
        { label: 'Total Cars', value: stats.totalCars, icon: FaCar, color: '#3b82f6', link: '/admin/cars' },
        { label: 'Used Cars', value: stats.usedCars, icon: FaCar, color: '#10b981', link: '/admin/cars?condition=Used' },
        { label: 'New Cars', value: stats.newCars, icon: FaCar, color: '#8b5cf6', link: '/admin/cars?condition=New' },
        { label: 'Featured', value: stats.featuredCars, icon: FaStar, color: '#f59e0b', link: '/admin/cars?featured=true' },
        { label: 'Auto Parts', value: stats.totalParts, icon: FaCogs, color: '#ef4444', link: '/admin/parts' },
        { label: 'Users', value: stats.totalUsers, icon: FaUsers, color: '#6366f1', link: '/admin/users' }
    ];

    const quickActions = [
        { label: 'Add Used Car', icon: FaCar, link: '/admin/add-car?condition=Used', color: '#10b981' },
        { label: 'Add New Car', icon: FaCar, link: '/admin/add-car?condition=New', color: '#8b5cf6' },
        { label: 'Add Auto Part', icon: FaCogs, link: '/admin/add-part', color: '#ef4444' }
    ];

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome to CarZar Admin Panel</p>
            </div>

            {/* Stats Cards */}
            <section className="stats-section">
                <h2>Overview</h2>
                <div className="stats-grid">
                    {statCards.map((card, index) => (
                        <Link
                            key={index}
                            to={card.link}
                            className="stat-card"
                            style={{ '--card-color': card.color }}
                        >
                            <div className="stat-icon">
                                <card.icon />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{card.value}</span>
                                <span className="stat-label">{card.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Instructions */}
            <section className="info-section">
                <h2>How to Use</h2>
                <div className="info-cards">
                    <div className="info-card">
                        <h3>Adding Used Cars</h3>
                        <p>Click "Add Used Car" to add a pre-owned vehicle listing. These will appear in the Used Cars section.</p>
                    </div>
                    <div className="info-card">
                        <h3>Adding New Cars</h3>
                        <p>Click "Add New Car" to add a brand new vehicle listing. These will appear in the New Cars section.</p>
                    </div>
                    <div className="info-card">
                        <h3>Adding Auto Parts</h3>
                        <p>Click "Add Auto Part" to list spare parts and accessories. These will appear in the Parts section.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
