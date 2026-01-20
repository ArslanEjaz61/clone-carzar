import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCar,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaPaperPlane
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const carsByMake = [
        { name: 'Toyota Cars', link: '/used-cars?make=toyota' },
        { name: 'Honda Cars', link: '/used-cars?make=honda' },
        { name: 'Suzuki Cars', link: '/used-cars?make=suzuki' },
        { name: 'Hyundai Cars', link: '/used-cars?make=hyundai' },
        { name: 'KIA Cars', link: '/used-cars?make=kia' },
        { name: 'Changan Cars', link: '/used-cars?make=changan' }
    ];

    const carsByCity = [
        { name: 'Cars in Lahore', link: '/used-cars?city=lahore' },
        { name: 'Cars in Karachi', link: '/used-cars?city=karachi' },
        { name: 'Cars in Islamabad', link: '/used-cars?city=islamabad' },
        { name: 'Cars in Rawalpindi', link: '/used-cars?city=rawalpindi' },
        { name: 'Cars in Faisalabad', link: '/used-cars?city=faisalabad' },
        { name: 'Cars in Multan', link: '/used-cars?city=multan' }
    ];

    const exploreLinks = [
        { name: 'About Us', link: '/about' },
        { name: 'Contact Us', link: '/contact' },
        { name: 'Careers', link: '/careers' },
        { name: 'Terms of Service', link: '/terms' },
        { name: 'Privacy Policy', link: '/privacy' },
        { name: 'FAQs', link: '/faqs' }
    ];

    const socialLinks = [
        { icon: <FaFacebookF />, link: 'https://facebook.com', name: 'Facebook' },
        { icon: <FaTwitter />, link: 'https://twitter.com', name: 'Twitter' },
        { icon: <FaInstagram />, link: 'https://instagram.com', name: 'Instagram' },
        { icon: <FaYoutube />, link: 'https://youtube.com', name: 'YouTube' },
        { icon: <FaLinkedinIn />, link: 'https://linkedin.com', name: 'LinkedIn' }
    ];

    return (
        <footer className="footer">
            {/* Main Footer */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Company Info */}
                        <div className="footer-column footer-about">
                            <Link to="/" className="footer-logo">
                                <FaCar className="footer-logo-icon" />
                                <span>CarZar</span>
                            </Link>
                            <p className="footer-description">
                                Pakistan's leading platform for buying and selling cars. Find your perfect vehicle from thousands of listings.
                            </p>
                            <div className="footer-contact">
                                <div className="footer-contact-item">
                                    <FaMapMarkerAlt />
                                    <span>Multan, Pakistan</span>
                                </div>
                                <div className="footer-contact-item">
                                    <FaPhone />
                                    <span>0301 3890851</span>
                                </div>
                                <div className="footer-contact-item">
                                    <FaEnvelope />
                                    <span>info@carzar.pk</span>
                                </div>
                            </div>
                        </div>

                        {/* Cars By Make */}
                        <div className="footer-column">
                            <h3 className="footer-title">Cars By Make</h3>
                            <ul className="footer-links">
                                {carsByMake.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.link}>{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cars By City */}
                        <div className="footer-column">
                            <h3 className="footer-title">Cars By City</h3>
                            <ul className="footer-links">
                                {carsByCity.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.link}>{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Explore */}
                        <div className="footer-column">
                            <h3 className="footer-title">Explore CarZar</h3>
                            <ul className="footer-links">
                                {exploreLinks.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.link}>{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="footer-column footer-newsletter">
                            <h3 className="footer-title">Newsletter</h3>
                            <p className="newsletter-text">
                                Subscribe to get the latest deals and updates.
                            </p>
                            <form className="newsletter-form" onSubmit={handleSubscribe}>
                                <div className="newsletter-input-wrapper">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="newsletter-input"
                                        required
                                    />
                                    <button type="submit" className="newsletter-btn">
                                        <FaPaperPlane />
                                    </button>
                                </div>
                                {subscribed && (
                                    <p className="newsletter-success">Thanks for subscribing!</p>
                                )}
                            </form>

                            {/* Social Links */}
                            <div className="footer-social">
                                <h4 className="social-title">Follow Us</h4>
                                <div className="social-links">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                            aria-label={social.name}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p className="copyright">
                        © {new Date().getFullYear()} CarZar. All rights reserved.
                    </p>
                    <div className="footer-bottom-links">
                        <Link to="/terms">Terms</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/sitemap">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
