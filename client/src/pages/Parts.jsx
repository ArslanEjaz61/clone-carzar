import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { partsAPI } from '../services/api';
import { FaCogs, FaFilter, FaTimes, FaShoppingCart, FaBolt } from 'react-icons/fa';
import './Parts.css';

const Parts = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        condition: '',
        city: '',
        priceMin: '',
        priceMax: ''
    });

    const categories = [
        'Engine Parts', 'Body Parts', 'Electrical', 'Suspension',
        'Brakes', 'Interior', 'Exterior', 'Wheels & Tires',
        'Accessories', 'Other'
    ];
    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];

    useEffect(() => {
        fetchParts();
    }, []);

    const samplePartsData = [
        { _id: '1', title: 'Toyota Corolla Front Bumper 2015-2023', category: 'Body Parts', condition: 'Used', price: 25000, city: 'Lahore', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }], contactPhone: '0300-1234567' },
        { _id: '2', title: 'Honda Civic LED Headlights Set', category: 'Electrical', condition: 'New', price: 65000, city: 'Karachi', images: [{ url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400' }], contactPhone: '0312-9876543' },
        { _id: '3', title: 'Alloy Rims 17 inch Universal', category: 'Wheels & Tires', condition: 'Used', price: 55000, city: 'Islamabad', images: [{ url: 'https://images.unsplash.com/photo-1611567069404-f4c47ae53c5f?w=400' }], contactPhone: '0321-5555555' },
        { _id: '4', title: 'Leather Seat Covers Full Set', category: 'Interior', condition: 'New', price: 18000, city: 'Lahore', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }], contactPhone: '0300-1111111' },
        { _id: '5', title: 'Engine Oil Filter Pack', category: 'Engine Parts', condition: 'New', price: 3500, city: 'Rawalpindi', images: [{ url: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=400' }], contactPhone: '0333-2222222' },
        { _id: '6', title: 'Brake Pads Set Front & Rear', category: 'Brakes', condition: 'New', price: 8500, city: 'Faisalabad', images: [{ url: 'https://images.unsplash.com/photo-1593697909683-bccb1b9e68a4?w=400' }], contactPhone: '0345-4444444' },
        { _id: '7', title: 'Car Audio System Pioneer', category: 'Accessories', condition: 'New', price: 35000, city: 'Lahore', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }], contactPhone: '0300-7777777' },
        { _id: '8', title: 'Suspension Kit Complete', category: 'Suspension', condition: 'New', price: 45000, city: 'Karachi', images: [{ url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400' }], contactPhone: '0312-8888888' }
    ];

    const fetchParts = async () => {
        setLoading(true);
        try {
            const response = await partsAPI.getAll(filters);
            // Check if response has data AND data array has items
            if (response.data?.data?.length > 0) {
                setParts(response.data.data);
            } else {
                // Use sample data if API returns empty
                console.log('No parts from API, using sample data');
                setParts(samplePartsData);
            }
        } catch (error) {
            console.log('API error, using sample data');
            setParts(samplePartsData);
        }
        setLoading(false);
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const applyFilters = () => {
        fetchParts();
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            condition: '',
            city: '',
            priceMin: '',
            priceMax: ''
        });
    };

    return (
        <main className="parts-page">
            <div className="container">
                <div className="page-header">
                    <h1><FaCogs /> Auto Parts & Accessories</h1>
                    <p>Find genuine and aftermarket parts for your vehicle</p>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    className="mobile-filter-btn"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? <FaTimes /> : <FaFilter />}
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                <div className="parts-layout">
                    {/* Filters Sidebar */}
                    <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                        <div className="filters-header">
                            <FaFilter /> Filters
                        </div>

                        <div className="filter-group">
                            <label>Category</label>
                            <select name="category" value={filters.category} onChange={handleFilterChange}>
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Condition</label>
                            <select name="condition" value={filters.condition} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>City</label>
                            <select name="city" value={filters.city} onChange={handleFilterChange}>
                                <option value="">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Price Range</label>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    name="priceMin"
                                    value={filters.priceMin}
                                    onChange={handleFilterChange}
                                    placeholder="Min"
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    name="priceMax"
                                    value={filters.priceMax}
                                    onChange={handleFilterChange}
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button className="btn btn-primary" onClick={applyFilters}>Apply Filters</button>
                            <button className="btn btn-secondary" onClick={clearFilters}>Clear</button>
                        </div>
                    </aside>

                    {/* Parts Grid */}
                    <div className="parts-content">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading parts...</p>
                            </div>
                        ) : parts.length === 0 ? (
                            <div className="empty-state">
                                <FaCogs className="empty-icon" />
                                <h3>No parts found</h3>
                                <p>Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="parts-grid">
                                {parts.map(part => (
                                    <Link to={`/parts/${part._id}`} key={part._id} className="part-card">
                                        <div className="part-image">
                                            <img
                                                src={part.images?.[0]?.url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}
                                                alt={part.title}
                                            />
                                            <span className={`condition-badge ${part.condition?.toLowerCase()}`}>
                                                {part.condition}
                                            </span>
                                        </div>
                                        <div className="part-info">
                                            <h3>{part.title}</h3>
                                            <span className="category">{part.category}</span>
                                            <p className="price">PKR {part.price?.toLocaleString()}</p>
                                            <p className="location">{part.city}</p>
                                            <div className="part-actions">
                                                <button className="btn btn-secondary add-to-cart-btn" onClick={(e) => e.preventDefault()}>
                                                    <FaShoppingCart /> Add to Cart
                                                </button>
                                                <button className="btn btn-primary buy-now-btn" onClick={(e) => e.preventDefault()}>
                                                    <FaBolt /> Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Parts;
