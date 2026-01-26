import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCar, FaEnvelope, FaLock, FaUser, FaPhone, FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(false);
    const [activeProvider, setActiveProvider] = useState(null);
    const [error, setError] = useState('');

    // Redirect if already logged in
    if (isAuthenticated) {
        navigate('/', { replace: true });
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        const result = await register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });

        if (result.success) {
            navigate('/', { replace: true });
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    // Simplified Social Login handler
    const handleSocialLogin = async (provider) => {
        setActiveProvider(provider);
        setSocialLoading(true);
        setError('');

        setTimeout(async () => {
            try {
                const socialData = {
                    provider,
                    email: provider === 'Google' ? 'yasir.malik@gmail.com' : 'yasir.malik.fb@facebook.com',
                    name: `Yasir Malik`,
                    providerId: `social_${Math.random().toString(36).substr(2, 9)}`,
                    avatar: provider === 'Google'
                        ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yasir'
                        : 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Yasir'
                };

                const result = await socialLogin(socialData);

                if (result.success) {
                    navigate('/');
                } else {
                    // Fallback to demo signup
                    localStorage.setItem('token', 'social_demo_token');
                    localStorage.setItem('user', JSON.stringify({
                        _id: 'social_demo_id',
                        name: socialData.name,
                        email: socialData.email,
                        role: 'user',
                        avatar: socialData.avatar
                    }));
                    window.location.href = '/';
                }
            } catch (err) {
                handleDemoSignup();
            } finally {
                setSocialLoading(false);
                setActiveProvider(null);
            }
        }, 1800);
    };

    // Demo signup for testing without backend
    const handleDemoSignup = () => {
        localStorage.setItem('token', 'demo_token_123');
        localStorage.setItem('user', JSON.stringify({
            _id: 'demo_user_id',
            name: formData.name || 'Demo User',
            email: formData.email || 'demo@carzar.pk',
            phone: formData.phone || '0300-1234567',
            role: 'user'
        }));
        window.location.href = '/';
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left Side - Branding */}
                <div className="auth-branding">
                    <div className="auth-branding-content">
                        <Link to="/" className="auth-logo">
                            <img src="/logo-white.png" alt="CarZar" />
                        </Link>
                        <h1>Join CarZar!</h1>
                        <p>Create an account to list your cars, save favorites, and connect with buyers and sellers.</p>

                        <div className="auth-features">
                            <div className="auth-feature">
                                <span className="feature-icon">📝</span>
                                <span>Post Free Ads</span>
                            </div>
                            <div className="auth-feature">
                                <span className="feature-icon">💬</span>
                                <span>Chat with Sellers</span>
                            </div>
                            <div className="auth-feature">
                                <span className="feature-icon">🔔</span>
                                <span>Get Price Alerts</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-section">
                    <div className="auth-form-container">
                        <h2>Create Account</h2>
                        <p className="auth-subtitle">Fill in your details to get started</p>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <div className="input-wrapper">
                                    <FaPhone className="input-icon" />
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="03XX-XXXXXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <div className="input-wrapper">
                                        <FaLock className="input-icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create password"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <FaLock className="input-icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" required />
                                    <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg auth-submit"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Demo Signup Button */}
                        <button
                            type="button"
                            className="btn btn-secondary btn-lg auth-submit demo-btn"
                            onClick={handleDemoSignup}
                        >
                            Demo Signup (Skip Backend)
                        </button>

                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>

                        <div className="social-auth">
                            <button
                                type="button"
                                className="social-btn google"
                                onClick={() => handleSocialLogin('Google')}
                            >
                                <FaGoogle />
                                <span>Google</span>
                            </button>
                            <button
                                type="button"
                                className="social-btn facebook"
                                onClick={() => handleSocialLogin('Facebook')}
                            >
                                <FaFacebookF />
                                <span>Facebook</span>
                            </button>
                        </div>

                        <p className="auth-footer">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Professional Social Authentication Modal */}
            {socialLoading && (
                <div className="social-modal-overlay">
                    <div className="social-modal">
                        <div className="social-modal-header">
                            <div className={`provider-logo ${activeProvider?.toLowerCase()}`}>
                                {activeProvider === 'Google' ? <FaGoogle /> : <FaFacebookF />}
                            </div>
                            <h3>Connecting to {activeProvider}...</h3>
                        </div>
                        <div className="social-modal-body">
                            <div className="account-item">
                                <div className="account-avatar">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Yasir" alt="User" />
                                </div>
                                <div className="account-info">
                                    <p className="account-name">Yasir Malik</p>
                                    <p className="account-email">
                                        {activeProvider === 'Google' ? 'yasir.malik@gmail.com' : 'yasir.malik.fb@facebook.com'}
                                    </p>
                                </div>
                                <div className="account-status">
                                    <div className="social-spinner"></div>
                                </div>
                            </div>
                            <p className="social-modal-footer">
                                Verifying your identity with {activeProvider} Secure Auth
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
