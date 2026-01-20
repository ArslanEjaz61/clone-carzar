import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, carsAPI } from '../services/api';
import CarCard from '../components/CarCard/CarCard';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import './MyAds.css';

const MyAds = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchListings();
    }, [isAuthenticated, activeTab]);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const params = activeTab !== 'all' ? { status: activeTab } : {};
            const response = await usersAPI.getMyListings(params);

            if (response.data?.data) {
                setListings(response.data.data);
                setStats(response.data.stats || { total: 0, active: 0, inactive: 0 });
            }
        } catch (error) {
            console.log('Using demo data');
            // Demo data
            setListings([]);
            setStats({ total: 0, active: 0, inactive: 0 });
        }
        setLoading(false);
    };

    const handleToggleActive = async (carId) => {
        try {
            await carsAPI.toggleActive(carId);
            fetchListings();
        } catch (error) {
            alert('Failed to update listing');
        }
    };

    const handleDelete = async (carId) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        try {
            await carsAPI.delete(carId);
            fetchListings();
        } catch (error) {
            alert('Failed to delete listing');
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <main className="my-ads-page">
            <div className="container">
                <div className="page-header">
                    <div className="page-header-left">
                        <h1>My Ads</h1>
                        <p className="results-count">Manage your car listings</p>
                    </div>
                    <Link to="/post-ad" className="btn btn-primary">
                        <FaPlus /> Post New Ad
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card" onClick={() => setActiveTab('all')}>
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Ads</span>
                    </div>
                    <div className="stat-card active" onClick={() => setActiveTab('active')}>
                        <span className="stat-value">{stats.active}</span>
                        <span className="stat-label">Active</span>
                    </div>
                    <div className="stat-card inactive" onClick={() => setActiveTab('inactive')}>
                        <span className="stat-value">{stats.inactive}</span>
                        <span className="stat-label">Inactive</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All ({stats.total})
                    </button>
                    <button
                        className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active ({stats.active})
                    </button>
                    <button
                        className={`tab ${activeTab === 'inactive' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inactive')}
                    >
                        Inactive ({stats.inactive})
                    </button>
                </div>

                {/* Listings */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your ads...</p>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="empty-state">
                        <h3>No ads yet</h3>
                        <p>You haven't posted any car listings yet.</p>
                        <Link to="/post-ad" className="btn btn-primary">
                            Post Your First Ad
                        </Link>
                    </div>
                ) : (
                    <div className="listings-list">
                        {listings.map(car => (
                            <div key={car._id} className={`listing-item ${!car.isActive ? 'inactive' : ''}`}>
                                <div className="listing-image">
                                    <img
                                        src={car.images?.[0]?.url || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400'}
                                        alt={car.title}
                                    />
                                    {!car.isActive && <span className="inactive-badge">Inactive</span>}
                                </div>
                                <div className="listing-info">
                                    <h3>{car.title}</h3>
                                    <p className="listing-price">PKR {car.price?.toLocaleString()}</p>
                                    <p className="listing-meta">
                                        <span>{car.year}</span>
                                        <span>•</span>
                                        <span>{car.mileage?.toLocaleString()} km</span>
                                        <span>•</span>
                                        <span>{car.city}</span>
                                    </p>
                                    <p className="listing-stats">
                                        <FaEye /> {car.views || 0} views
                                    </p>
                                </div>
                                <div className="listing-actions">
                                    <button
                                        className="action-btn"
                                        onClick={() => handleToggleActive(car._id)}
                                        title={car.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        {car.isActive ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    <Link to={`/edit-ad/${car._id}`} className="action-btn" title="Edit">
                                        <FaEdit />
                                    </Link>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDelete(car._id)}
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyAds;
