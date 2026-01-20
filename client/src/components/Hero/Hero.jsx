import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCar, FaCog } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('parts');
    const [searchData, setSearchData] = useState({
        keyword: '',
        city: 'All Cities',
        make: 'All Makes'
    });

    const tabs = [
        { id: 'parts', label: 'Find Parts', icon: <FaCog /> },
        { id: 'used', label: 'Find Used Cars', icon: <FaCar /> },
        { id: 'new', label: 'Find New Cars', icon: <FaCar /> }
    ];

    const cities = [
        'All Cities', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi',
        'Faisalabad', 'Multan', 'Peshawar', 'Quetta'
    ];

    const makes = [
        'All Makes', 'Toyota', 'Honda', 'Suzuki', 'Hyundai', 'KIA',
        'Changan', 'MG', 'BAIC', 'BMW', 'Mercedes', 'Audi'
    ];

    const handleInputChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();

        if (searchData.keyword) queryParams.append('q', searchData.keyword);
        if (searchData.city && searchData.city !== 'All Cities') {
            queryParams.append('city', searchData.city.toLowerCase());
        }
        if (searchData.make && searchData.make !== 'All Makes') {
            queryParams.append('make', searchData.make.toLowerCase());
        }

        let searchUrl;
        switch (activeTab) {
            case 'parts':
                searchUrl = `/parts?${queryParams.toString()}`;
                break;
            case 'used':
                searchUrl = `/used-cars?${queryParams.toString()}`;
                break;
            case 'new':
                searchUrl = `/new-cars?${queryParams.toString()}`;
                break;
            default:
                searchUrl = `/parts?${queryParams.toString()}`;
        }

        navigate(searchUrl);
    };

    return (
        <section className="hero">
            <div className="hero-bg"></div>

            <div className="container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Find Your Perfect <span className="highlight">Vehicle</span>
                    </h1>
                    <p className="hero-subtitle">
                        Pakistan's #1 Platform for Buying and Selling Cars - CarZar
                    </p>

                    {/* Search Box */}
                    <div className="search-container">
                        {/* Tabs */}
                        <div className="tabs-row">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Search Form */}
                        <form className="search-row" onSubmit={handleSearch}>
                            <input
                                type="text"
                                name="keyword"
                                className="search-input"
                                placeholder="Search by keyword (e.g., Toyota Corolla 2020)"
                                value={searchData.keyword}
                                onChange={handleInputChange}
                            />

                            <select
                                name="city"
                                className="search-select"
                                value={searchData.city}
                                onChange={handleInputChange}
                            >
                                {cities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            <select
                                name="make"
                                className="search-select"
                                value={searchData.make}
                                onChange={handleInputChange}
                            >
                                {makes.map((make) => (
                                    <option key={make} value={make}>{make}</option>
                                ))}
                            </select>

                            <button type="submit" className="search-btn">
                                <FaSearch />
                                <span>Search</span>
                            </button>
                        </form>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        <div className="stat">
                            <strong>50,000+</strong>
                            <span>Used Cars</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <strong>200+</strong>
                            <span>New Car Models</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <strong>10,000+</strong>
                            <span>Active Dealers</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
