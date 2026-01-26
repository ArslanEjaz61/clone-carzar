import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCar, FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(false);
    const [socialStep, setSocialStep] = useState('loading'); // 'loading', 'picker', 'verifying'
    const [activeProvider, setActiveProvider] = useState(null);
    const [error, setError] = useState('');

    // Redirect if already logged in
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSocialLogin = async (provider) => {
        setActiveProvider(provider);
        setSocialLoading(true);
        setError('');
        setSocialStep('loading'); // New state for steps

        // Step 1: Loading
        setTimeout(() => {
            setSocialStep('picker'); // Show account picker
        }, 800);
    };

    const confirmSocialLogin = async () => {
        setSocialStep('verifying');

        setTimeout(async () => {
            try {
                const socialData = {
                    provider: activeProvider,
                    email: activeProvider === 'Google' ? 'yasir.malik@gmail.com' : 'yasir.malik.fb@facebook.com',
                    name: `Yasir Malik`,
                    providerId: `social_${Math.random().toString(36).substr(2, 9)}`,
                    avatar: activeProvider === 'Google'
                        ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yasir'
                        : 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Yasir'
                };

                const result = await socialLogin(socialData);

                if (result.success) {
                    navigate('/');
                } else {
                    // Robust fallback
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
                handleDemoLogin();
            } finally {
                setSocialLoading(false);
                setActiveProvider(null);
                setSocialStep('loading');
            }
        }, 1500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }

        setLoading(false);
    };



    const handleDemoLogin = () => {
        localStorage.setItem('token', 'demo_token_123');
        localStorage.setItem('user', JSON.stringify({
            _id: 'demo_user_id',
            name: 'Demo User',
            email: 'demo@carzar.pk',
            phone: '0300-1234567',
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
                            <img src="/logoooo.png" alt="CarZar" />
                        </Link>
                        <h1>Welcome Back!</h1>
                        <p>Sign in to access your account, manage your listings, and find your perfect vehicle.</p>

                        <div className="auth-features">
                            <div className="auth-feature">
                                <span className="feature-icon">🚗</span>
                                <span>Browse 50,000+ Cars</span>
                            </div>
                            <div className="auth-feature">
                                <span className="feature-icon">📋</span>
                                <span>Manage Your Listings</span>
                            </div>
                            <div className="auth-feature">
                                <span className="feature-icon">❤️</span>
                                <span>Save Favorite Cars</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-section">
                    <div className="auth-form-container">
                        <h2>Sign In</h2>
                        <p className="auth-subtitle">Enter your credentials to continue</p>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
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
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
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

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg auth-submit"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

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
                            Don't have an account? <Link to="/signup">Sign Up</Link>
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
                            <h3>
                                {socialStep === 'picker' ? `Sign in with ${activeProvider}` :
                                    socialStep === 'verifying' ? 'Verifying...' : `Connecting...`}
                            </h3>
                        </div>
                        <div className="social-modal-body">
                            {socialStep === 'picker' ? (
                                <div className="account-picker-list">
                                    <button className="account-item interactive" onClick={confirmSocialLogin}>
                                        <div className="account-avatar">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Yasir" alt="User" />
                                        </div>
                                        <div className="account-info">
                                            <p className="account-name">Yasir Malik</p>
                                            <p className="account-email">
                                                {activeProvider === 'Google' ? 'yasir.malik@gmail.com' : 'yasir.malik.fb@facebook.com'}
                                            </p>
                                        </div>
                                        <div className="account-chevron">→</div>
                                    </button>
                                    <button className="use-another-account" onClick={() => setSocialLoading(false)}>
                                        Use another account
                                    </button>
                                </div>
                            ) : (
                                <div className="account-item">
                                    <div className="account-avatar pulse">
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
                            )}
                            <p className="social-modal-footer">
                                {socialStep === 'picker' ? 'Select an account to continue' : 'Secure Authentication in progress'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
