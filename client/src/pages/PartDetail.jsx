import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    FaHeart,
    FaRegHeart,
    FaShare,
    FaShoppingCart,
    FaBolt,
    FaMapMarkerAlt,
    FaCogs,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaUser,
    FaClock,
    FaTag,
    FaCheck
} from 'react-icons/fa';
import { partsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './PartDetail.css';

// Sample parts data - same as used in Parts.jsx and FeaturedParts
const samplePartsData = [
    {
        _id: 'sample-1',
        title: 'Toyota Corolla Side Mirror - Left',
        category: 'Body Parts',
        price: 8500,
        condition: 'New',
        city: 'Lahore',
        description: 'Original Toyota Corolla side mirror (left). Perfect condition, fits all Corolla models 2014-2023. Easy installation.',
        compatibleMakes: ['Toyota'],
        features: ['OEM Original', 'Perfect Fit', 'Easy Installation', 'Warranty Available'],
        images: [{ url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800' }],
        seller: { name: 'Toyota Parts Hub', memberSince: 'Jan 2021', totalAds: 45 }
    },
    {
        _id: 'sample-2',
        title: 'Honda Civic Air Filter',
        category: 'Filters & Fluids',
        price: 2500,
        condition: 'New',
        city: 'Karachi',
        description: 'High-quality air filter for Honda Civic. Improves engine performance and fuel efficiency. Genuine aftermarket part.',
        compatibleMakes: ['Honda'],
        features: ['High Quality', 'Better Performance', 'Long Lasting', 'Easy to Install'],
        images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' }],
        seller: { name: 'Filter King', memberSince: 'Mar 2020', totalAds: 120 }
    },
    {
        _id: 'sample-3',
        title: 'Brake Pads Set - Universal',
        category: 'Brakes',
        price: 4500,
        condition: 'New',
        city: 'Islamabad',
        description: 'Universal brake pads set for front wheels. High performance ceramic material. Suitable for most sedans.',
        compatibleMakes: ['Toyota', 'Honda', 'Suzuki'],
        features: ['Ceramic Material', 'Low Dust', 'Quiet Braking', 'Universal Fit'],
        images: [{ url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800' }],
        seller: { name: 'Brake Masters', memberSince: 'Jun 2019', totalAds: 89 }
    },
    {
        _id: 'sample-4',
        title: 'LED Headlight Bulbs Pair',
        category: 'Electrical',
        price: 3200,
        condition: 'New',
        city: 'Rawalpindi',
        description: 'Super bright LED headlight bulbs pair. 6000K white light, 200% brighter than halogen. Easy plug-and-play installation.',
        compatibleMakes: ['Universal'],
        features: ['6000K White Light', '200% Brighter', 'Easy Installation', '50000 Hours Life'],
        images: [{ url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800' }],
        seller: { name: 'LED World', memberSince: 'Sep 2021', totalAds: 67 }
    },
    {
        _id: 'sample-5',
        title: 'Engine Oil 5W-30 (4L)',
        category: 'Filters & Fluids',
        price: 6500,
        condition: 'New',
        city: 'Lahore',
        description: 'Premium synthetic engine oil 5W-30. 4 liter pack. Suitable for petrol engines. Excellent engine protection.',
        compatibleMakes: ['Universal'],
        features: ['Full Synthetic', '4 Liters', 'Engine Protection', 'Better Mileage'],
        images: [{ url: 'https://images.unsplash.com/photo-1635784063388-1ff609e36f3a?w=800' }],
        seller: { name: 'Oil Express', memberSince: 'Feb 2020', totalAds: 156 }
    },
    {
        _id: 'sample-6',
        title: 'Alloy Wheel 16 inch',
        category: 'Tyres & Wheels',
        price: 15000,
        condition: 'Used',
        city: 'Multan',
        description: 'Used alloy wheel 16 inch. Good condition with minor scratches. Fits Honda and Toyota vehicles.',
        compatibleMakes: ['Honda', 'Toyota'],
        features: ['16 Inch Size', 'Light Weight', 'Good Condition', 'Universal Bolt Pattern'],
        images: [{ url: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800' }],
        seller: { name: 'Wheel Zone', memberSince: 'Jul 2018', totalAds: 234 }
    },
    {
        _id: '1',
        title: 'Toyota Corolla Front Bumper 2015-2023',
        category: 'Body Parts',
        price: 25000,
        condition: 'Used',
        city: 'Lahore',
        description: 'Original Toyota Corolla front bumper in excellent condition. Fits all Corolla models from 2015-2023.',
        compatibleMakes: ['Toyota'],
        features: ['OEM Original Part', 'No Cracks', 'Good Paint Condition', 'Easy Installation'],
        images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' }],
        seller: { name: 'Auto Parts Store', memberSince: 'Jan 2020', totalAds: 85 }
    },
    {
        _id: '2',
        title: 'Honda Civic LED Headlights Set',
        category: 'Electrical',
        price: 65000,
        condition: 'New',
        city: 'Karachi',
        description: 'Brand new LED headlights set for Honda Civic. Includes both left and right headlights.',
        compatibleMakes: ['Honda'],
        features: ['LED Technology', 'Bright Output', 'Easy Installation', '2 Year Warranty'],
        images: [{ url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800' }],
        seller: { name: 'Light House', memberSince: 'Apr 2019', totalAds: 78 }
    }
];

const PartDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, isInCart, getItemQuantity } = useCart();
    const [part, setPart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        fetchPartDetails();
    }, [id]);

    const fetchPartDetails = async () => {
        setLoading(true);
        try {
            const response = await partsAPI.getById(id);
            if (response.data?.data) {
                setPart(response.data.data);
            } else {
                // Find matching sample part by ID
                const samplePart = samplePartsData.find(p => p._id === id);
                setPart(samplePart || samplePartsData[0]);
            }
        } catch (error) {
            console.log('Using sample data - backend not available');
            // Find matching sample part by ID
            const samplePart = samplePartsData.find(p => p._id === id);
            setPart(samplePart || samplePartsData[0]);
        }
        setLoading(false);
    };

    const formatPrice = (price) => {
        if (price >= 100000) {
            return `PKR ${(price / 100000).toFixed(1)} Lac`;
        }
        return `PKR ${price?.toLocaleString() || 0}`;
    };

    // Calculate total price based on quantity
    const totalPrice = (part?.price || 0) * quantity;

    const handlePrevImage = () => {
        const images = getImages();
        setCurrentImageIndex(prev =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        const images = getImages();
        setCurrentImageIndex(prev =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const getImages = () => {
        if (!part?.images || part.images.length === 0) {
            return ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'];
        }
        return part.images.map(img => typeof img === 'string' ? img : img?.url);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: part?.title,
                text: `Check out this ${part?.title} on CarZar`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleAddToCart = () => {
        addToCart(part, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(part, quantity);
        navigate('/cart');
    };

    if (loading) {
        return (
            <main className="part-detail-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading part details...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!part) {
        return (
            <main className="part-detail-page">
                <div className="container">
                    <div className="no-results">
                        <h3>Part not found</h3>
                        <p>The part you're looking for doesn't exist or has been removed.</p>
                        <Link to="/parts" className="btn btn-primary">Browse Parts</Link>
                    </div>
                </div>
            </main>
        );
    }

    const images = getImages();
    const currentImage = images[currentImageIndex] || images[0];

    return (
        <main className="part-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/parts">Auto Parts</Link>
                    <span>/</span>
                    <span>{part.title}</span>
                </nav>

                <div className="part-detail-content">
                    {/* Left Column - Images & Info */}
                    <div className="part-detail-main">
                        {/* Image Gallery */}
                        <div className="part-gallery">
                            <div className="gallery-main">
                                <img src={currentImage} alt={part.title} />
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
                                <span className={`condition-badge ${part.condition?.toLowerCase()}`}>
                                    {part.condition}
                                </span>
                            </div>
                            {images.length > 1 && (
                                <div className="gallery-thumbs">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`gallery-thumb ${index === currentImageIndex ? 'active' : ''}`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        >
                                            <img src={img} alt={`Thumbnail ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Part Title & Actions */}
                        <div className="part-header">
                            <div className="part-header-left">
                                <h1 className="part-title">{part.title}</h1>
                                <div className="part-meta">
                                    <span className="part-category"><FaTag /> {part.category}</span>
                                    <span><FaMapMarkerAlt /> {part.city}</span>
                                    <span><FaClock /> {part.postedDate || 'Recently posted'}</span>
                                </div>
                            </div>
                            <div className="part-header-right">
                                <button
                                    className={`action-btn ${isFavorite ? 'active' : ''}`}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                                </button>
                                <button className="action-btn" onClick={handleShare}>
                                    <FaShare />
                                </button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="part-price-section">
                            <span className="price-value">{formatPrice(part.price)}</span>
                            <span className="price-per-unit">per unit</span>
                        </div>

                        {/* Description */}
                        <div className="detail-section">
                            <h2 className="detail-title">Description</h2>
                            <p className="part-description">{part.description || 'No description provided.'}</p>
                        </div>

                        {/* Compatible Makes */}
                        {part.compatibleMakes && part.compatibleMakes.length > 0 && (
                            <div className="detail-section">
                                <h2 className="detail-title">Compatible Makes</h2>
                                <div className="compatible-makes">
                                    {part.compatibleMakes.map((make, index) => (
                                        <span key={index} className="make-tag">{make}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        {part.features && part.features.length > 0 && (
                            <div className="detail-section">
                                <h2 className="detail-title">Features</h2>
                                <div className="features-grid">
                                    {part.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <FaCheckCircle />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Buy Section */}
                    <aside className="part-detail-sidebar">
                        <div className="buy-card">
                            <div className="buy-price">
                                <span className="price-label">Total Price</span>
                                <span className="price-amount">{formatPrice(totalPrice)}</span>
                                {quantity > 1 && (
                                    <span className="price-breakdown">
                                        ({quantity} × {formatPrice(part.price)})
                                    </span>
                                )}
                            </div>

                            <div className="quantity-selector">
                                <span className="quantity-label">Quantity</span>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="quantity-value">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                            </div>

                            <div className="buy-actions">
                                <button
                                    className={`btn btn-cart btn-lg ${addedToCart ? 'added' : ''}`}
                                    onClick={handleAddToCart}
                                >
                                    {addedToCart ? <FaCheck /> : <FaShoppingCart />}
                                    {addedToCart ? 'Added!' : 'Add to Cart'}
                                </button>
                                <button className="btn btn-buy btn-lg" onClick={handleBuyNow}>
                                    <FaBolt />
                                    Buy Now
                                </button>
                            </div>

                            <div className="seller-info-small">
                                <div className="seller-avatar-small">
                                    <FaUser />
                                </div>
                                <div>
                                    <p className="seller-name-small">{part.seller?.name || 'Private Seller'}</p>
                                    <p className="seller-meta-small">Member since {part.seller?.memberSince || '2020'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <h4>Shipping & Returns</h4>
                            <ul>
                                <li>Free shipping on orders above PKR 5,000</li>
                                <li>7-day return policy</li>
                                <li>Cash on delivery available</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default PartDetail;
