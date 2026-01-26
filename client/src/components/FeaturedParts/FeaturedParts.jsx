import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight, FaArrowRight, FaCog, FaMapMarkerAlt } from 'react-icons/fa';
import { partsAPI, BASE_URL } from '../../services/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FeaturedParts.css';

// Custom arrow components
const NextArrow = ({ onClick }) => (
    <button className="parts-slider-arrow parts-slider-next" onClick={onClick}>
        <FaChevronRight />
    </button>
);

const PrevArrow = ({ onClick }) => (
    <button className="parts-slider-arrow parts-slider-prev" onClick={onClick}>
        <FaChevronLeft />
    </button>
);

// Format price to PKR
const formatPrice = (price) => {
    if (price >= 100000) {
        return `PKR ${(price / 100000).toFixed(1)} Lacs`;
    }
    return `PKR ${price.toLocaleString()}`;
};

const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
};

const FeaturedParts = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedParts();
    }, []);

    const fetchFeaturedParts = async () => {
        setLoading(true);
        try {
            const response = await partsAPI.getAll({ limit: 10, featured: true });
            if (response.data?.data?.length > 0) {
                setParts(response.data.data);
            } else {
                setParts([]);
            }
        } catch (error) {
            console.error('Error fetching featured parts:', error);
            setParts([]);
        }
        setLoading(false);
    };

    if (!loading && parts.length === 0) {
        return null; // Hide section if no parts
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: true,
                    centerMode: false,
                    variableWidth: false
                }
            }
        ]
    };

    return (
        <section className="featured-parts-section section">
            <div className="container">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            <FaCog className="section-icon" />
                            Featured Auto Parts
                        </h2>
                        <p className="section-subtitle">Quality parts for all car makes and models</p>
                    </div>
                    <Link to="/parts" className="view-all-link">
                        View All Parts
                        <FaArrowRight />
                    </Link>
                </div>

                {loading ? (
                    <div className="parts-loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="parts-slider">
                        <Slider {...settings}>
                            {parts.map((part) => (
                                <div key={part._id} className="parts-slide-item">
                                    <Link to={`/parts/${part._id}`} className="part-card-new">
                                        <div className="part-card-image">
                                            <img
                                                src={getImageUrl(part.images?.[0]?.url)}
                                                alt={part.title}
                                            />
                                            <span className={`part-condition ${part.condition?.toLowerCase()}`}>
                                                {part.condition}
                                            </span>
                                        </div>
                                        <div className="part-card-content">
                                            <h4 className="part-card-title">{part.title}</h4>
                                            <p className="part-card-category">{part.category}</p>
                                            <div className="part-card-location">
                                                <FaMapMarkerAlt />
                                                <span>{part.city}</span>
                                            </div>
                                            <div className="part-card-price">
                                                {formatPrice(part.price)}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedParts;
