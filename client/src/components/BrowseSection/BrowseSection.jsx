import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import './BrowseSection.css';

const BrowseSection = () => {
    const [activeTab, setActiveTab] = useState('category');

    const tabs = [
        { id: 'category', label: 'Category' },
        { id: 'budget', label: 'Budget' },
        { id: 'make', label: 'Make' },
        { id: 'body', label: 'Body Type' },
        { id: 'city', label: 'City' }
    ];

    const categoryData = [
        { name: 'Used Cars', count: '50,000+', link: '/used-cars', emoji: '🚗' },
        { name: 'New Cars', count: '200+', link: '/new-cars', emoji: '✨' },
        { name: 'Certified Cars', count: '1,500+', link: '/used-cars?certified=true', emoji: '✅' },
        { name: 'Featured Cars', count: '500+', link: '/used-cars?featured=true', emoji: '⭐' },
        { name: 'Imported Cars', count: '3,000+', link: '/used-cars?assembly=imported', emoji: '🌍' },
        { name: 'Low Mileage', count: '5,000+', link: '/used-cars?mileage=50000', emoji: '📉' }
    ];

    const budgetData = [
        { name: 'Under 10 Lac', link: '/used-cars?priceMax=1000000' },
        { name: '10-25 Lac', link: '/used-cars?priceMin=1000000&priceMax=2500000' },
        { name: '25-50 Lac', link: '/used-cars?priceMin=2500000&priceMax=5000000' },
        { name: '50-75 Lac', link: '/used-cars?priceMin=5000000&priceMax=7500000' },
        { name: '75 Lac - 1 Crore', link: '/used-cars?priceMin=7500000&priceMax=10000000' },
        { name: 'Above 1 Crore', link: '/used-cars?priceMin=10000000' }
    ];

    const makeData = [
        { name: 'Toyota', count: '15,000+', link: '/used-cars?make=toyota' },
        { name: 'Honda', count: '12,000+', link: '/used-cars?make=honda' },
        { name: 'Suzuki', count: '10,000+', link: '/used-cars?make=suzuki' },
        { name: 'Hyundai', count: '3,000+', link: '/used-cars?make=hyundai' },
        { name: 'KIA', count: '2,500+', link: '/used-cars?make=kia' },
        { name: 'Changan', count: '1,500+', link: '/used-cars?make=changan' },
        { name: 'MG', count: '1,000+', link: '/used-cars?make=mg' },
        { name: 'BMW', count: '500+', link: '/used-cars?make=bmw' }
    ];

    const bodyData = [
        { name: 'Sedan', link: '/used-cars?bodyType=sedan', emoji: '🚗' },
        { name: 'Hatchback', link: '/used-cars?bodyType=hatchback', emoji: '🚙' },
        { name: 'SUV', link: '/used-cars?bodyType=suv', emoji: '🚐' },
        { name: 'Crossover', link: '/used-cars?bodyType=crossover', emoji: '🛻' },
        { name: 'Pickup', link: '/used-cars?bodyType=pickup', emoji: '🛻' },
        { name: 'Van', link: '/used-cars?bodyType=van', emoji: '🚌' }
    ];

    const cityData = [
        { name: 'Lahore', count: '12,000+', link: '/used-cars?city=lahore' },
        { name: 'Karachi', count: '15,000+', link: '/used-cars?city=karachi' },
        { name: 'Islamabad', count: '8,000+', link: '/used-cars?city=islamabad' },
        { name: 'Rawalpindi', count: '5,000+', link: '/used-cars?city=rawalpindi' },
        { name: 'Faisalabad', count: '3,000+', link: '/used-cars?city=faisalabad' },
        { name: 'Multan', count: '2,500+', link: '/used-cars?city=multan' },
        { name: 'Peshawar', count: '2,000+', link: '/used-cars?city=peshawar' },
        { name: 'Quetta', count: '1,000+', link: '/used-cars?city=quetta' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'category':
                return (
                    <div className="browse-cards-grid">
                        {categoryData.map((item, index) => (
                            <Link to={item.link} key={index} className="browse-card category-card">
                                <span className="browse-card-emoji">{item.emoji}</span>
                                <div className="browse-card-info">
                                    <h4>{item.name}</h4>
                                    <span className="browse-card-count">{item.count} ads</span>
                                </div>
                                <FaChevronRight className="browse-card-arrow" />
                            </Link>
                        ))}
                    </div>
                );

            case 'budget':
                return (
                    <div className="browse-list-grid">
                        {budgetData.map((item, index) => (
                            <Link to={item.link} key={index} className="browse-list-item">
                                <span>{item.name}</span>
                                <FaChevronRight />
                            </Link>
                        ))}
                    </div>
                );

            case 'make':
                return (
                    <div className="browse-make-grid">
                        {makeData.map((item, index) => (
                            <Link to={item.link} key={index} className="browse-make-card">
                                <h4>{item.name}</h4>
                                <span className="browse-make-count">{item.count}</span>
                            </Link>
                        ))}
                    </div>
                );

            case 'body':
                return (
                    <div className="browse-cards-grid">
                        {bodyData.map((item, index) => (
                            <Link to={item.link} key={index} className="browse-card body-card">
                                <span className="browse-card-emoji">{item.emoji}</span>
                                <h4>{item.name}</h4>
                                <FaChevronRight className="browse-card-arrow" />
                            </Link>
                        ))}
                    </div>
                );

            case 'city':
                return (
                    <div className="browse-make-grid">
                        {cityData.map((item, index) => (
                            <Link to={item.link} key={index} className="browse-city-card">
                                <h4>Cars in {item.name}</h4>
                                <span className="browse-city-count">{item.count}</span>
                            </Link>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <section className="browse-section section">
            <div className="container">
                <h2 className="section-title text-center">Browse Cars</h2>

                {/* Tabs */}
                <div className="browse-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`browse-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="browse-content">
                    {renderContent()}
                </div>
            </div>
        </section>
    );
};

export default BrowseSection;
