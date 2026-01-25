import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaTh, FaList, FaSortAmountDown, FaChevronDown } from 'react-icons/fa';
import SearchFilters from '../components/SearchFilters/SearchFilters';
import CarCard from '../components/CarCard/CarCard';
import { carsAPI } from '../services/api';
import './UsedCars.css';

// Sample cars data for when backend is not available
const UsedCars = ({ condition = 'Used' }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState({
        make: searchParams.get('make')?.split(',') || [],
        model: [],
        city: searchParams.get('city')?.split(',') || [],
        fuelType: [],
        transmission: [],
        priceMin: searchParams.get('priceMin') || '',
        priceMax: searchParams.get('priceMax') || '',
        yearFrom: searchParams.get('yearFrom') || '',
        yearTo: searchParams.get('yearTo') || ''
    });
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 1
    });

    useEffect(() => {
        fetchCars();
    }, [filters, sortBy, pagination.page, condition]);

    const fetchCars = async () => {
        setLoading(true);

        try {
            // Build query params
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                sort: sortBy === 'newest' ? 'createdAt' : sortBy === 'oldest' ? 'createdAt' : 'price',
                order: sortBy === 'newest' || sortBy === 'price_high' ? 'desc' : 'asc',
                condition: condition // Filter by Used or New
            };

            if (filters.make.length) params.make = filters.make.join(',');
            if (filters.model.length) params.model = filters.model.join(',');
            if (filters.city.length) params.city = filters.city.join(',');
            if (filters.fuelType.length) params.fuelType = filters.fuelType.join(',');
            if (filters.transmission.length) params.transmission = filters.transmission.join(',');
            if (filters.priceMin) params.priceMin = filters.priceMin;
            if (filters.priceMax) params.priceMax = filters.priceMax;
            if (filters.yearFrom) params.yearFrom = filters.yearFrom;
            if (filters.yearTo) params.yearTo = filters.yearTo;

            const response = await carsAPI.getAll(params);

            if (response.data?.data?.length > 0) {
                setCars(response.data.data);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.pagination?.total || 0,
                    pages: response.data.pagination?.pages || 1
                }));
            } else {
                setCars([]);
                setPagination(prev => ({ ...prev, total: 0, pages: 1 }));
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
            setCars([]);
            setPagination(prev => ({ ...prev, total: 0, pages: 1 }));
        }

        setLoading(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => {
            if (Array.isArray(prev[key])) {
                const arr = prev[key];
                if (arr.includes(value)) {
                    return { ...prev, [key]: arr.filter(v => v !== value) };
                } else {
                    return { ...prev, [key]: [...arr, value] };
                }
            }
            return { ...prev, [key]: value };
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({
            make: [],
            model: [],
            city: [],
            fuelType: [],
            transmission: [],
            priceMin: '',
            priceMax: '',
            yearFrom: '',
            yearTo: ''
        });
        setSearchParams({});
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'mileage_low', label: 'Mileage: Low to High' }
    ];

    return (
        <main className="used-cars-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-header-left">
                        <h1>{condition} Cars for Sale in Pakistan</h1>
                        <p className="results-count">{pagination.total || cars.length} Cars Found</p>
                    </div>
                </div>

                <div className="page-content">
                    {/* Filters Sidebar */}
                    <SearchFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />

                    {/* Listings */}
                    <div className="listings-container">
                        {/* Toolbar */}
                        <div className="listings-toolbar">
                            <div className="toolbar-left">
                                <div className="sort-dropdown">
                                    <FaSortAmountDown />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        {sortOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FaChevronDown className="dropdown-arrow" />
                                </div>
                            </div>
                            <div className="toolbar-right">
                                <div className="view-toggles">
                                    <button
                                        className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                        aria-label="Grid view"
                                    >
                                        <FaTh />
                                    </button>
                                    <button
                                        className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                                        onClick={() => setViewMode('list')}
                                        aria-label="List view"
                                    >
                                        <FaList />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Car Listings */}
                        {loading ? (
                            <div className="listings-loading">
                                <div className="spinner"></div>
                                <p>Loading cars...</p>
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="no-results">
                                <h3>No cars found</h3>
                                <p>Try adjusting your filters to find more results.</p>
                                <button className="btn btn-primary" onClick={handleClearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className={`listings-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                                {cars.map((car, index) => (
                                    <CarCard
                                        key={car.id || car._id || index}
                                        car={car}
                                        featured={index < 3}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="pagination">
                                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                {pagination.pages > 5 && (
                                    <>
                                        <span className="pagination-dots">...</span>
                                        <button
                                            className="pagination-btn"
                                            onClick={() => handlePageChange(pagination.pages)}
                                        >
                                            {pagination.pages}
                                        </button>
                                    </>
                                )}
                                {pagination.page < pagination.pages && (
                                    <button
                                        className="pagination-btn pagination-next"
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UsedCars;
