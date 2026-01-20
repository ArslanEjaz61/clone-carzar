import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import BrowseSection from '../components/BrowseSection/BrowseSection';
import FeaturedCars from '../components/FeaturedCars/FeaturedCars';
import FeaturedParts from '../components/FeaturedParts/FeaturedParts';
import './Home.css';

const Home = () => {
    return (
        <main className="home-page">
            <Hero />

            {/* Featured Auto Parts - Actual Parts Slider */}
            <FeaturedParts />

            <BrowseSection />
            <FeaturedCars
                title="Featured Used Cars For Sale"
                type="used"
            />
            <FeaturedCars
                title="Featured New Cars"
                type="new"
            />

            {/* Why Choose Us Section */}
            <section className="why-choose section">
                <div className="container">
                    <h2 className="section-title text-center">Why Choose CarZar?</h2>
                    <div className="why-choose-grid">
                        <div className="why-choose-card">
                            <div className="why-choose-icon">🚗</div>
                            <h3>50,000+ Cars</h3>
                            <p>Wide selection of verified used and new cars from trusted sellers.</p>
                        </div>
                        <div className="why-choose-card">
                            <div className="why-choose-icon">✅</div>
                            <h3>Verified Listings</h3>
                            <p>All listings are verified to ensure authenticity and quality.</p>
                        </div>
                        <div className="why-choose-card">
                            <div className="why-choose-icon">💰</div>
                            <h3>Best Prices</h3>
                            <p>Compare prices and find the best deals on your dream car.</p>
                        </div>
                        <div className="why-choose-card">
                            <div className="why-choose-icon">🔒</div>
                            <h3>Secure Transactions</h3>
                            <p>Safe and secure platform for buying and selling vehicles.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Makes Section */}
            <section className="popular-makes section bg-white">
                <div className="container">
                    <h2 className="section-title text-center">Popular Makes</h2>
                    <div className="makes-grid">
                        {[
                            { name: 'Toyota', emoji: '🚗' },
                            { name: 'Honda', emoji: '🏎️' },
                            { name: 'Suzuki', emoji: '🚙' },
                            { name: 'Hyundai', emoji: '🚘' },
                            { name: 'KIA', emoji: '🚐' },
                            { name: 'Changan', emoji: '🚕' },
                            { name: 'MG', emoji: '🏁' },
                            { name: 'BMW', emoji: '🚑' }
                        ].map((make, index) => (
                            <Link
                                to={`/used-cars?make=${make.name.toLowerCase()}`}
                                key={index}
                                className="make-card"
                            >
                                <div className="make-logo">{make.emoji}</div>
                                <span className="make-name">{make.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Download App Section - Coming Soon */}
            <section className="download-app section">
                <div className="container">
                    <div className="download-app-content">
                        <div className="download-app-text">
                            <h2>CarZar Mobile App</h2>
                            <p>Browse cars on the go with our mobile app. Get instant notifications for new listings and price drops.</p>
                            <div className="coming-soon-badge">
                                <span className="pulse-dot"></span>
                                <span>Coming Soon</span>
                            </div>
                            <p className="notify-text">We're working hard to bring you the best car buying experience on mobile. Stay tuned!</p>
                        </div>
                        <div className="download-app-image">
                            <img
                                src="/app-mockup.png"
                                alt="CarZar Mobile App"
                                className="app-mockup-image"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
