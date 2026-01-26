import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaGasPump, FaCog, FaMapMarkerAlt, FaTachometerAlt, FaCamera, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { BASE_URL, getImageUrl as buildImageUrl } from '../../services/api';
import './CarCard.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400';
const CONTACT_NUMBER = '03013890851';

const CarCard = ({ car, featured = false, onFavoriteToggle }) => {
    const [isFavorite, setIsFavorite] = useState(car.isFavorite || false);
    const [imageError, setImageError] = useState(false);

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `PKR ${(price / 10000000).toFixed(1)} Crore`;
        } else if (price >= 100000) {
            return `PKR ${(price / 100000).toFixed(1)} Lac`;
        }
        return `PKR ${price?.toLocaleString() || 0}`;
    };

    const formatMileage = (mileage) => {
        if (mileage >= 1000) {
            return `${(mileage / 1000).toFixed(0)}K km`;
        }
        return `${mileage} km`;
    };

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        if (onFavoriteToggle) {
            onFavoriteToggle(car.id || car._id, !isFavorite);
        }
    };

    // Get image URL with proper handling for local uploads
    const getImageUrl = () => {
        if (imageError) return FALLBACK_IMAGE;

        let url = car.image || car.images?.[0]?.url || car.images?.[0];

        if (!url) return FALLBACK_IMAGE;

        // Use the centralized helper
        const builtUrl = buildImageUrl(typeof url === 'string' ? url : url?.url);
        return builtUrl || FALLBACK_IMAGE;
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const imageUrl = getImageUrl();
    const imageCount = car.images?.length || 1;

    return (
        <Link to={`/car/${car.id || car._id || car.slug}`} className="car-card-link">
            <article className={`car-card ${featured ? 'featured' : ''}`}>
                {/* Image Section */}
                <div className="car-card-image">
                    <img
                        src={imageUrl}
                        alt={car.title}
                        loading="lazy"
                        onError={handleImageError}
                    />

                    {/* Featured Badge */}
                    {featured && (
                        <span className="car-badge featured-badge">Featured</span>
                    )}

                    {/* Image Count */}
                    {imageCount > 1 && (
                        <span className="image-count">
                            <FaCamera />
                            <span>{imageCount}</span>
                        </span>
                    )}

                    {/* Favorite Button */}
                    <button
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        onClick={handleFavoriteClick}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                </div>

                {/* Content Section */}
                <div className="car-card-content">
                    <h3 className="car-title">{car.title}</h3>

                    <div className="car-price">
                        {formatPrice(car.price)}
                    </div>

                    {/* Specs Grid */}
                    <div className="car-specs">
                        <div className="spec-item">
                            <FaTachometerAlt />
                            <span>{car.year}</span>
                        </div>
                        <div className="spec-item">
                            <FaCog />
                            <span>{formatMileage(car.mileage)}</span>
                        </div>
                        <div className="spec-item">
                            <FaGasPump />
                            <span>{car.fuelType}</span>
                        </div>
                        <div className="spec-item">
                            <FaCog />
                            <span>{car.transmission}</span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="car-location">
                        <FaMapMarkerAlt />
                        <span>{car.city}</span>
                        {car.engineCapacity && (
                            <span className="engine-capacity">• {car.engineCapacity}cc</span>
                        )}
                    </div>

                    {/* Contact Buttons */}
                    <div className="car-contact-actions">
                        <a
                            href={`tel:${CONTACT_NUMBER}`}
                            className="contact-btn call-btn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaPhone /> Call
                        </a>
                        <a
                            href={`https://wa.me/92${CONTACT_NUMBER.slice(1)}?text=Hi, I'm interested in: ${car.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-btn whatsapp-btn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaWhatsapp /> WhatsApp
                        </a>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default CarCard;
