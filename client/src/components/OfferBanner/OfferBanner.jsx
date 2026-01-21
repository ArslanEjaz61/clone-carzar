import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './OfferBanner.css';

const OfferBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const bannerText = "🎉 20% OFF on All Auto Parts! • Limited Time Offer • Shop Now • Free Delivery on Orders Above 5000 PKR • ";

    return (
        <div className="offer-banner">
            <div className="marquee-container">
                <div className="marquee-content">
                    <span>{bannerText}</span>
                    <span>{bannerText}</span>
                    <span>{bannerText}</span>
                </div>
            </div>

            <button
                className="offer-close"
                onClick={() => setIsVisible(false)}
                aria-label="Close offer"
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default OfferBanner;
