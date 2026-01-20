import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight, FaArrowRight, FaCog, FaMapMarkerAlt } from 'react-icons/fa';
import { partsAPI } from '../../services/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FeaturedParts.css';

// Sample data for when backend has no parts
const sampleParts = [
    {
        _id: 'sample-1',
        title: 'Toyota Corolla Side Mirror - Left',
        category: 'Body Parts',
        price: 8500,
        condition: 'New',
        compatibleMakes: ['Toyota'],
        city: 'Lahore',
        images: [{ url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400' }]
    },
    {
        _id: 'sample-2',
        title: 'Honda Civic Air Filter',
        category: 'Filters & Fluids',
        price: 2500,
        condition: 'New',
        compatibleMakes: ['Honda'],
        city: 'Karachi',
        images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }]
    },
    {
        _id: 'sample-3',
        title: 'Brake Pads Set - Universal',
        category: 'Brakes',
        price: 4500,
        condition: 'New',
        compatibleMakes: ['Toyota', 'Honda', 'Suzuki'],
        city: 'Islamabad',
        images: [{ url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400' }]
    },
    {
        _id: 'sample-4',
        title: 'LED Headlight Bulbs Pair',
        category: 'Electrical',
        price: 3200,
        condition: 'New',
        compatibleMakes: ['Universal'],
        city: 'Rawalpindi',
        images: [{ url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400' }]
    },
    {
        _id: 'sample-5',
        title: 'Engine Oil 5W-30 (4L)',
        category: 'Filters & Fluids',
        price: 6500,
        condition: 'New',
        compatibleMakes: ['Universal'],
        city: 'Lahore',
        images: [{ url: 'https://images.unsplash.com/photo-1635784063388-1ff609e36f3a?w=400' }]
    },
    {
        _id: 'sample-6',
        title: 'Alloy Wheel 16 inch',
        category: 'Tyres & Wheels',
        price: 15000,
        condition: 'Used',
        compatibleMakes: ['Honda', 'Toyota'],
        city: 'Multan',
        images: [{ url: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400' }]
    }
];

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
                // Use sample data if no backend data
                setParts(sampleParts);
            }
        } catch (error) {
            console.log('Using sample parts - backend not available');
            setParts(sampleParts);
        }
        setLoading(false);
    };

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
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: true,
                    centerMode: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    centerMode: true,
                    centerPadding: '30px'
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
                                                src={part.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
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
