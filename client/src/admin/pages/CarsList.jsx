import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminAPI, carsAPI, BASE_URL, getImageUrl } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaStar, FaEye, FaEyeSlash, FaCar } from 'react-icons/fa';
import './CarsList.css';

const CarsList = () => {
    const [searchParams] = useSearchParams();
    const conditionFilter = searchParams.get('condition');
    const featuredFilter = searchParams.get('featured');

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCars();
    }, [page, conditionFilter, featuredFilter]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15 };
            if (conditionFilter) params.condition = conditionFilter;
            if (featuredFilter) params.featured = featuredFilter;

            const response = await adminAPI.getCars(params);
            if (response.data?.data) {
                setCars(response.data.data);
                setTotalPages(response.data.pagination?.pages || 1);
            }
        } catch (error) {
            console.log('Using sample data');
            // Sample data for demo
            setCars([
                { _id: '1', title: 'Toyota Corolla GLi', make: 'Toyota', year: 2022, price: 4500000, condition: 'Used', isActive: true, isFeatured: true, city: 'Lahore' },
                { _id: '2', title: 'Honda Civic Oriel', make: 'Honda', year: 2023, price: 6800000, condition: 'New', isActive: true, isFeatured: false, city: 'Karachi' },
                { _id: '3', title: 'Suzuki Alto VXR', make: 'Suzuki', year: 2022, price: 2100000, condition: 'Used', isActive: true, isFeatured: false, city: 'Islamabad' }
            ]);
        }
        setLoading(false);
    };

    const handleToggleFeatured = async (carId) => {
        try {
            await adminAPI.toggleCarFeatured(carId);
            fetchCars();
        } catch (error) {
            // Demo mode - just toggle locally
            setCars(prev => prev.map(car =>
                car._id === carId ? { ...car, isFeatured: !car.isFeatured } : car
            ));
        }
    };

    const handleToggleActive = async (carId) => {
        try {
            await adminAPI.toggleCarActive(carId);
            fetchCars();
        } catch (error) {
            // Demo mode - just toggle locally
            setCars(prev => prev.map(car =>
                car._id === carId ? { ...car, isActive: !car.isActive } : car
            ));
        }
    };

    const handleDelete = async (carId) => {
        if (!confirm('Are you sure you want to delete this car?')) return;

        try {
            await adminAPI.deleteCar(carId);
            fetchCars();
        } catch (error) {
            // Demo mode - remove locally
            setCars(prev => prev.filter(car => car._id !== carId));
        }
    };

    const getTitle = () => {
        if (conditionFilter === 'New') return 'New Cars';
        if (conditionFilter === 'Used') return 'Used Cars';
        if (featuredFilter === 'true') return 'Featured Cars';
        return 'All Cars';
    };

    return (
        <div className="cars-list-page">
            <div className="page-header">
                <div>
                    <h1><FaCar /> {getTitle()}</h1>
                    <p>{cars.length} listings found</p>
                </div>
                <Link to="/admin/add-car" className="btn btn-primary">
                    <FaPlus /> Add New Car
                </Link>
            </div>

            {/* Filters */}
            <div className="filter-tabs">
                <Link to="/admin/cars" className={`tab ${!conditionFilter && !featuredFilter ? 'active' : ''}`}>All</Link>
                <Link to="/admin/cars?condition=Used" className={`tab ${conditionFilter === 'Used' ? 'active' : ''}`}>Used</Link>
                <Link to="/admin/cars?condition=New" className={`tab ${conditionFilter === 'New' ? 'active' : ''}`}>New</Link>
                <Link to="/admin/cars?featured=true" className={`tab ${featuredFilter === 'true' ? 'active' : ''}`}>Featured</Link>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading cars...</p>
                </div>
            ) : cars.length === 0 ? (
                <div className="empty-state">
                    <FaCar className="empty-icon" />
                    <h3>No cars found</h3>
                    <p>Start by adding a new car listing</p>
                    <Link to="/admin/add-car" className="btn btn-primary">Add Car</Link>
                </div>
            ) : (
                <div className="cars-table-container">
                    <table className="cars-table">
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>Price</th>
                                <th>Condition</th>
                                <th>City</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car._id} className={!car.isActive ? 'inactive' : ''}>
                                    <td className="car-info">
                                        <div className="car-image">
                                            <img
                                                src={getImageUrl(car.images?.[0]?.url || 'https://via.placeholder.com/80x60?text=Car')}
                                                alt={car.title}
                                            />
                                        </div>
                                        <div className="car-details">
                                            <h4>{car.title}</h4>
                                            <span>{car.make} • {car.year}</span>
                                        </div>
                                    </td>
                                    <td className="price">PKR {car.price?.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${car.condition?.toLowerCase()}`}>
                                            {car.condition}
                                        </span>
                                    </td>
                                    <td>{car.city}</td>
                                    <td>
                                        <div className="status-badges">
                                            {car.isFeatured && <span className="badge featured">Featured</span>}
                                            <span className={`badge ${car.isActive ? 'active' : 'inactive'}`}>
                                                {car.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="actions">
                                        <button
                                            className={`action-btn ${car.isFeatured ? 'featured' : ''}`}
                                            onClick={() => handleToggleFeatured(car._id)}
                                            title={car.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                                        >
                                            <FaStar />
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleToggleActive(car._id)}
                                            title={car.isActive ? 'Deactivate' : 'Activate'}
                                        >
                                            {car.isActive ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                        <Link to={`/admin/edit-car/${car._id}`} className="action-btn" title="Edit">
                                            <FaEdit />
                                        </Link>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDelete(car._id)}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CarsList;
