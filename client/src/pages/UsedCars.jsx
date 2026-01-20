import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaTh, FaList, FaSortAmountDown, FaChevronDown } from 'react-icons/fa';
import SearchFilters from '../components/SearchFilters/SearchFilters';
import CarCard from '../components/CarCard/CarCard';
import { carsAPI } from '../services/api';
import './UsedCars.css';

// Sample cars data for when backend is not available
const sampleCars = [
    {
        id: 1,
        title: 'Toyota Corolla GLi 1.3 VVTi',
        price: 4500000,
        year: 2022,
        mileage: 25000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Lahore',
        engineCapacity: 1300,
        image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400'
    },
    {
        id: 2,
        title: 'Honda Civic Oriel 1.8 i-VTEC',
        price: 6200000,
        year: 2021,
        mileage: 35000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Karachi',
        engineCapacity: 1800,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'
    },
    {
        id: 3,
        title: 'Suzuki Alto VXR 660cc',
        price: 2100000,
        year: 2023,
        mileage: 15000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        city: 'Islamabad',
        engineCapacity: 660,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
    },
    {
        id: 4,
        title: 'KIA Sportage Alpha AWD',
        price: 8500000,
        year: 2022,
        mileage: 20000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Rawalpindi',
        engineCapacity: 2000,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'
    },
    {
        id: 5,
        title: 'Hyundai Tucson GLS Sport',
        price: 9200000,
        year: 2023,
        mileage: 10000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Lahore',
        engineCapacity: 2000,
        image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400'
    },
    {
        id: 6,
        title: 'Toyota Yaris ATIV X CVT 1.5',
        price: 4800000,
        year: 2022,
        mileage: 18000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Multan',
        engineCapacity: 1500,
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'
    },
    {
        id: 7,
        title: 'Honda City 1.5L Aspire',
        price: 5500000,
        year: 2022,
        mileage: 22000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Karachi',
        engineCapacity: 1500,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'
    },
    {
        id: 8,
        title: 'Suzuki Cultus VXL AGS',
        price: 2800000,
        year: 2023,
        mileage: 12000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Faisalabad',
        engineCapacity: 1000,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
    },
    {
        id: 9,
        title: 'Toyota Fortuner Sigma 4',
        price: 15500000,
        year: 2021,
        mileage: 45000,
        fuelType: 'Diesel',
        transmission: 'Auto',
        city: 'Islamabad',
        engineCapacity: 2800,
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'
    },
    {
        id: 10,
        title: 'Changan Alsvin Lumiere',
        price: 4200000,
        year: 2023,
        mileage: 8000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Lahore',
        engineCapacity: 1500,
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'
    },
    {
        id: 11,
        title: 'MG HS Exclusive',
        price: 7800000,
        year: 2023,
        mileage: 5000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Rawalpindi',
        engineCapacity: 1500,
        image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400'
    },
    {
        id: 12,
        title: 'Hyundai Elantra GLS',
        price: 5900000,
        year: 2022,
        mileage: 28000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Karachi',
        engineCapacity: 1600,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'
    }
];

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
                // Use filtered sample data
                let filteredCars = [...sampleCars];

                // Apply client-side filters to sample data
                if (filters.make.length) {
                    filteredCars = filteredCars.filter(car =>
                        filters.make.some(m => car.title.toLowerCase().includes(m.toLowerCase()))
                    );
                }
                if (filters.city.length) {
                    filteredCars = filteredCars.filter(car =>
                        filters.city.some(c => car.city.toLowerCase() === c.toLowerCase())
                    );
                }
                if (filters.priceMin) {
                    filteredCars = filteredCars.filter(car => car.price >= parseInt(filters.priceMin));
                }
                if (filters.priceMax) {
                    filteredCars = filteredCars.filter(car => car.price <= parseInt(filters.priceMax));
                }

                // Apply sorting
                if (sortBy === 'price_low') {
                    filteredCars.sort((a, b) => a.price - b.price);
                } else if (sortBy === 'price_high') {
                    filteredCars.sort((a, b) => b.price - a.price);
                }

                setCars(filteredCars);
                setPagination(prev => ({ ...prev, total: filteredCars.length, pages: 1 }));
            }
        } catch (error) {
            console.log('Using sample data - backend not available');
            setCars(sampleCars);
            setPagination(prev => ({ ...prev, total: sampleCars.length, pages: 1 }));
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
