import { Link } from 'react-router-dom';
import { FaArrowRight, FaTachometerAlt, FaCog, FaTools } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-bg"></div>

            <div className="container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Find Your Perfect <span className="highlight">Auto Products</span>
                    </h1>
                    <p className="hero-subtitle">
                        Pakistan's #1 Platform for Premium Auto Parts & Accessories - CarZar
                    </p>

                    {/* Hot Selling Products Banner */}
                    <div className="hot-products-banner">
                        <div className="hot-products-content">
                            <div className="hot-products-text">
                                <span className="hot-products-label">OUR NEW</span>
                                <h2 className="hot-products-title">
                                    HOT SELLING
                                    <span className="fire-container">
                                        <span className="fire-icon fire-1">🔥</span>
                                        <span className="sparkle sparkle-1">✨</span>
                                        <span className="sparkle sparkle-2">✨</span>
                                        <span className="sparkle sparkle-3">✨</span>
                                    </span>
                                    <br />
                                    <span className="gradient-text">PRODUCTS</span>
                                </h2>
                                <p className="hot-products-description">
                                    Premium automotive accessories and parts for your vehicle
                                </p>
                                <Link to="/parts" className="hot-products-btn">
                                    Shop Now
                                    <FaArrowRight />
                                </Link>
                            </div>
                            <div className="hot-products-image">
                                <div className="single-product-showcase">
                                    <img src="/design.jpeg" alt="Hot Selling Product" className="showcase-main-img" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        <div className="stat">
                            <strong>5,000+</strong>
                            <span>Auto Parts</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <strong>100+</strong>
                            <span>Product Categories</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <strong>500+</strong>
                            <span>Active Sellers</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
