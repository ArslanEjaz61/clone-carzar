import { useState } from 'react';
import {
    FaFilter,
    FaTimes,
    FaChevronDown,
    FaChevronUp,
    FaSearch
} from 'react-icons/fa';
import './SearchFilters.css';

const SearchFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const [expandedSections, setExpandedSections] = useState({
        make: true,
        model: true,
        price: true,
        year: true,
        mileage: true,
        fuelType: true,
        transmission: true,
        city: true
    });
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const makes = [
        'Toyota', 'Honda', 'Suzuki', 'Hyundai', 'KIA', 'Changan',
        'MG', 'BAIC', 'BMW', 'Mercedes', 'Audi', 'Nissan'
    ];

    const models = {
        'Toyota': ['Corolla', 'Yaris', 'Aqua', 'Prius', 'Camry', 'Land Cruiser', 'Fortuner'],
        'Honda': ['Civic', 'City', 'BR-V', 'HR-V', 'Vezel', 'Accord'],
        'Suzuki': ['Alto', 'Cultus', 'Swift', 'Wagon R', 'Bolan', 'Every'],
        'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Ioniq'],
        'KIA': ['Sportage', 'Picanto', 'Sorento', 'Stonic', 'Carnival']
    };

    const cities = [
        'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
        'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'
    ];

    const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG', 'LPG'];
    const transmissions = ['Automatic', 'Manual'];

    const priceRanges = [
        { label: 'Under 10 Lac', min: 0, max: 1000000 },
        { label: '10 - 20 Lac', min: 1000000, max: 2000000 },
        { label: '20 - 30 Lac', min: 2000000, max: 3000000 },
        { label: '30 - 50 Lac', min: 3000000, max: 5000000 },
        { label: '50 Lac - 1 Crore', min: 5000000, max: 10000000 },
        { label: 'Above 1 Crore', min: 10000000, max: null }
    ];

    const years = Array.from({ length: 25 }, (_, i) => 2024 - i);
    const mileageRanges = [
        { label: '0 - 10,000 km', max: 10000 },
        { label: '10,000 - 50,000 km', min: 10000, max: 50000 },
        { label: '50,000 - 100,000 km', min: 50000, max: 100000 },
        { label: 'Above 100,000 km', min: 100000 }
    ];

    const FilterSection = ({ title, id, children }) => (
        <div className="filter-section">
            <button
                className="filter-section-header"
                onClick={() => toggleSection(id)}
            >
                <span>{title}</span>
                {expandedSections[id] ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSections[id] && (
                <div className="filter-section-content">
                    {children}
                </div>
            )}
        </div>
    );

    const filtersContent = (
        <>
            {/* Make */}
            <FilterSection title="Make" id="make">
                <div className="filter-search">
                    <FaSearch />
                    <input type="text" placeholder="Search make..." />
                </div>
                <div className="filter-options">
                    {makes.map((make, index) => (
                        <label key={index} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={filters?.make?.includes(make)}
                                onChange={() => onFilterChange('make', make)}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-label">{make}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Model */}
            {filters?.make && filters.make.length > 0 && (
                <FilterSection title="Model" id="model">
                    <div className="filter-options">
                        {filters.make.map(make =>
                            models[make]?.map((model, index) => (
                                <label key={`${make}-${index}`} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={filters?.model?.includes(model)}
                                        onChange={() => onFilterChange('model', model)}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-label">{model}</span>
                                </label>
                            ))
                        )}
                    </div>
                </FilterSection>
            )}

            {/* Price Range */}
            <FilterSection title="Price Range" id="price">
                <div className="filter-range-inputs">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters?.priceMin || ''}
                        onChange={(e) => onFilterChange('priceMin', e.target.value)}
                        className="input"
                    />
                    <span>to</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters?.priceMax || ''}
                        onChange={(e) => onFilterChange('priceMax', e.target.value)}
                        className="input"
                    />
                </div>
                <div className="filter-options">
                    {priceRanges.map((range, index) => (
                        <label key={index} className="filter-radio">
                            <input
                                type="radio"
                                name="priceRange"
                                onChange={() => {
                                    onFilterChange('priceMin', range.min);
                                    onFilterChange('priceMax', range.max);
                                }}
                            />
                            <span className="radio-custom"></span>
                            <span className="radio-label">{range.label}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Year */}
            <FilterSection title="Year" id="year">
                <div className="filter-range-inputs">
                    <select
                        value={filters?.yearFrom || ''}
                        onChange={(e) => onFilterChange('yearFrom', e.target.value)}
                        className="select"
                    >
                        <option value="">From</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <span>to</span>
                    <select
                        value={filters?.yearTo || ''}
                        onChange={(e) => onFilterChange('yearTo', e.target.value)}
                        className="select"
                    >
                        <option value="">To</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </FilterSection>

            {/* Mileage */}
            <FilterSection title="Mileage" id="mileage">
                <div className="filter-options">
                    {mileageRanges.map((range, index) => (
                        <label key={index} className="filter-radio">
                            <input
                                type="radio"
                                name="mileage"
                                onChange={() => {
                                    onFilterChange('mileageMin', range.min);
                                    onFilterChange('mileageMax', range.max);
                                }}
                            />
                            <span className="radio-custom"></span>
                            <span className="radio-label">{range.label}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Fuel Type */}
            <FilterSection title="Fuel Type" id="fuelType">
                <div className="filter-options">
                    {fuelTypes.map((type, index) => (
                        <label key={index} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={filters?.fuelType?.includes(type)}
                                onChange={() => onFilterChange('fuelType', type)}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-label">{type}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Transmission */}
            <FilterSection title="Transmission" id="transmission">
                <div className="filter-options">
                    {transmissions.map((type, index) => (
                        <label key={index} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={filters?.transmission?.includes(type)}
                                onChange={() => onFilterChange('transmission', type)}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-label">{type}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* City */}
            <FilterSection title="City" id="city">
                <div className="filter-search">
                    <FaSearch />
                    <input type="text" placeholder="Search city..." />
                </div>
                <div className="filter-options">
                    {cities.map((city, index) => (
                        <label key={index} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={filters?.city?.includes(city)}
                                onChange={() => onFilterChange('city', city)}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-label">{city}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>
        </>
    );

    return (
        <>
            {/* Mobile Filter Toggle */}
            <button
                className="mobile-filter-toggle"
                onClick={() => setMobileFiltersOpen(true)}
            >
                <FaFilter />
                <span>Filters</span>
            </button>

            {/* Desktop Sidebar */}
            <aside className="search-filters">
                <div className="filters-header">
                    <h3>
                        <FaFilter />
                        <span>Filters</span>
                    </h3>
                    <button className="clear-filters" onClick={onClearFilters}>
                        Clear All
                    </button>
                </div>
                {filtersContent}
            </aside>

            {/* Mobile Filters Modal */}
            <div className={`mobile-filters-overlay ${mobileFiltersOpen ? 'active' : ''}`}>
                <div className="mobile-filters-modal">
                    <div className="mobile-filters-header">
                        <h3>Filters</h3>
                        <button onClick={() => setMobileFiltersOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className="mobile-filters-content">
                        {filtersContent}
                    </div>
                    <div className="mobile-filters-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onClearFilters}
                        >
                            Clear All
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setMobileFiltersOpen(false)}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchFilters;
