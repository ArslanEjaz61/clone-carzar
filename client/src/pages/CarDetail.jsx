import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FaHeart,
    FaRegHeart,
    FaShare,
    FaPhone,
    FaWhatsapp,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaTachometerAlt,
    FaGasPump,
    FaCogs,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaUser,
    FaClock,
    FaShieldAlt
} from 'react-icons/fa';
import { carsAPI } from '../services/api';
import './CarDetail.css';

// Sample car data for when backend is not available
const sampleCar = {
    id: '1',
    title: 'Toyota Corolla GLi 1.3 VVTi',
    price: 4500000,
    year: 2022,
    mileage: 25000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    city: 'Lahore',
    engineCapacity: 1300,
    color: 'White',
    registrationCity: 'Lahore',
    assembly: 'Local',
    bodyType: 'Sedan',
    doors: 4,
    seatingCapacity: 5,
    description: `This Toyota Corolla GLi 1.3 VVTi is in excellent condition. The car has been well maintained by a single owner. Features include power steering, power windows, central locking, alloy rims, air conditioning, and much more.

The car is available for inspection at any time. All original documents are available and ready for transfer. No accident history, genuine mileage.

Contact for price negotiation.`,
    features: [
        'Power Steering',
        'Power Windows',
        'Air Conditioning',
        'Alloy Rims',
        'Central Locking',
        'Anti-Lock Braking System (ABS)',
        'Airbags',
        'Immobilizer Key',
        'Rear Camera',
        'Navigation System'
    ],
    images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800'
    ],
    seller: {
        name: 'Ahmed Motors',
        phone: '0300-1234567',
        memberSince: 'Jan 2020',
        totalAds: 45,
        verified: true
    },
    postedDate: '2 days ago',
    views: 156
};

const CarDetail = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showPhone, setShowPhone] = useState(false);

    useEffect(() => {
        fetchCarDetails();
    }, [id]);

    const fetchCarDetails = async () => {
        setLoading(true);
        try {
            const response = await carsAPI.getById(id);
            if (response.data?.data) {
                setCar(response.data.data);
            } else {
                setCar(sampleCar);
            }
        } catch (error) {
            console.log('Using sample data - backend not available');
            setCar(sampleCar);
        }
        setLoading(false);
    };

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `PKR ${(price / 10000000).toFixed(1)} Crore`;
        } else if (price >= 100000) {
            return `PKR ${(price / 100000).toFixed(1)} Lac`;
        }
        return `PKR ${price?.toLocaleString() || 0}`;
    };

    const handlePrevImage = () => {
        const images = car?.images || [];
        setCurrentImageIndex(prev =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        const images = car?.images || [];
        setCurrentImageIndex(prev =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: car?.title,
                text: `Check out this ${car?.title} on CarZar`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <main className="car-detail-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading car details...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!car) {
        return (
            <main className="car-detail-page">
                <div className="container">
                    <div className="no-results">
                        <h3>Car not found</h3>
                        <p>The car you're looking for doesn't exist or has been removed.</p>
                        <Link to="/used-cars" className="btn btn-primary">Browse Cars</Link>
                    </div>
                </div>
            </main>
        );
    }

    const images = car.images || [car.image] || [sampleCar.images[0]];
    const currentImage = typeof images[currentImageIndex] === 'string'
        ? images[currentImageIndex]
        : images[currentImageIndex]?.url || sampleCar.images[0];

    return (
        <main className="car-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/used-cars">Used Cars</Link>
                    <span>/</span>
                    <span>{car.title}</span>
                </nav>

                <div className="car-detail-content">
                    {/* Left Column - Images & Info */}
                    <div className="car-detail-main">
                        {/* Image Gallery */}
                        <div className="car-gallery">
                            <div className="gallery-main">
                                <img
                                    src={currentImage}
                                    alt={car.title}
                                />
                                {images.length > 1 && (
                                    <>
                                        <button className="gallery-nav gallery-prev" onClick={handlePrevImage}>
                                            <FaChevronLeft />
                                        </button>
                                        <button className="gallery-nav gallery-next" onClick={handleNextImage}>
                                            <FaChevronRight />
                                        </button>
                                    </>
                                )}
                                <div className="gallery-counter">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </div>
                            {images.length > 1 && (
                                <div className="gallery-thumbs">
                                    {images.map((img, index) => {
                                        const thumbUrl = typeof img === 'string' ? img : img?.url;
                                        return (
                                            <button
                                                key={index}
                                                className={`gallery-thumb ${index === currentImageIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                            >
                                                <img src={thumbUrl} alt={`Thumbnail ${index + 1}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Car Title & Actions */}
                        <div className="car-header">
                            <div className="car-header-left">
                                <h1 className="car-title">{car.title}</h1>
                                <div className="car-meta">
                                    <span><FaMapMarkerAlt /> {car.city}</span>
                                    <span><FaClock /> {car.postedDate || 'Recently posted'}</span>
                                    <span>{car.views || 0} views</span>
                                </div>
                            </div>
                            <div className="car-header-right">
                                <button
                                    className={`action-btn ${isFavorite ? 'active' : ''}`}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                                </button>
                                <button className="action-btn" onClick={handleShare} aria-label="Share">
                                    <FaShare />
                                </button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="car-price">
                            <span className="price-value">{formatPrice(car.price)}</span>
                        </div>

                        {/* Quick Specs */}
                        <div className="quick-specs">
                            <div className="spec-item">
                                <FaCalendarAlt />
                                <div className="spec-info">
                                    <span className="spec-label">Year</span>
                                    <span className="spec-value">{car.year}</span>
                                </div>
                            </div>
                            <div className="spec-item">
                                <FaTachometerAlt />
                                <div className="spec-info">
                                    <span className="spec-label">Mileage</span>
                                    <span className="spec-value">{(car.mileage || 0).toLocaleString()} km</span>
                                </div>
                            </div>
                            <div className="spec-item">
                                <FaGasPump />
                                <div className="spec-info">
                                    <span className="spec-label">Fuel Type</span>
                                    <span className="spec-value">{car.fuelType}</span>
                                </div>
                            </div>
                            <div className="spec-item">
                                <FaCogs />
                                <div className="spec-info">
                                    <span className="spec-label">Transmission</span>
                                    <span className="spec-value">{car.transmission}</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Specs */}
                        <div className="detail-section">
                            <h2 className="detail-title">Car Details</h2>
                            <div className="specs-grid">
                                <div className="spec-row">
                                    <span className="spec-key">Registered In</span>
                                    <span className="spec-val">{car.registrationCity || car.city}</span>
                                </div>
                                <div className="spec-row">
                                    <span className="spec-key">Color</span>
                                    <span className="spec-val">{car.color || 'Not specified'}</span>
                                </div>
                                <div className="spec-row">
                                    <span className="spec-key">Assembly</span>
                                    <span className="spec-val">{car.assembly || 'Local'}</span>
                                </div>
                                <div className="spec-row">
                                    <span className="spec-key">Engine Capacity</span>
                                    <span className="spec-val">{car.engineCapacity || 'N/A'} cc</span>
                                </div>
                                <div className="spec-row">
                                    <span className="spec-key">Body Type</span>
                                    <span className="spec-val">{car.bodyType || 'Sedan'}</span>
                                </div>
                                <div className="spec-row">
                                    <span className="spec-key">Seating Capacity</span>
                                    <span className="spec-val">{car.seatingCapacity || 5}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="detail-section">
                            <h2 className="detail-title">Seller Comments</h2>
                            <p className="car-description">{car.description || 'No description provided.'}</p>
                        </div>

                        {/* Features */}
                        {car.features && car.features.length > 0 && (
                            <div className="detail-section">
                                <h2 className="detail-title">Features</h2>
                                <div className="features-grid">
                                    {car.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <FaCheckCircle />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Seller Info */}
                    <aside className="car-detail-sidebar">
                        <div className="seller-card">
                            <div className="seller-header">
                                <div className="seller-avatar">
                                    <FaUser />
                                </div>
                                <div className="seller-info">
                                    <h3 className="seller-name">
                                        {car.seller?.name || 'Private Seller'}
                                        {car.seller?.verified && (
                                            <FaShieldAlt className="verified-badge" title="Verified Seller" />
                                        )}
                                    </h3>
                                    <p className="seller-meta">Member since {car.seller?.memberSince || '2020'}</p>
                                    <p className="seller-meta">{car.seller?.totalAds || 1} ads posted</p>
                                </div>
                            </div>

                            <div className="seller-actions">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => setShowPhone(!showPhone)}
                                >
                                    <FaPhone />
                                    {showPhone ? (car.contactPhone || car.seller?.phone || '0300-1234567') : 'Show Phone Number'}
                                </button>
                                <a
                                    href={`https://wa.me/92${(car.contactPhone || car.seller?.phone || '0300-1234567').replace(/[^0-9]/g, '').slice(1)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-whatsapp btn-lg"
                                >
                                    <FaWhatsapp />
                                    WhatsApp
                                </a>
                            </div>

                            <div className="safety-tips">
                                <h4>Safety Tips</h4>
                                <ul>
                                    <li>Meet seller at a safe public place</li>
                                    <li>Check the vehicle before you buy</li>
                                    <li>Pay only after collecting the car</li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default CarDetail;
