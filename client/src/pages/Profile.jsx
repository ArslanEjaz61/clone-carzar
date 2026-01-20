import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaLock } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || ''
            });
        }
    }, [isAuthenticated, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await authAPI.updateProfile(formData);
            setSuccess('Profile updated successfully!');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await authAPI.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setSuccess('Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update password');
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            await authAPI.deleteAccount();
            logout();
            navigate('/');
        } catch (error) {
            setError('Failed to delete account');
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <main className="profile-page">
            <div className="container">
                <div className="profile-container">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-avatar">
                            <div className="avatar-placeholder">
                                <FaUser />
                            </div>
                            <button className="avatar-edit" title="Change avatar">
                                <FaCamera />
                            </button>
                        </div>
                        <h2 className="profile-name">{user?.name}</h2>
                        <p className="profile-email">{user?.email}</p>

                        <nav className="profile-nav">
                            <button
                                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <FaUser /> Profile Settings
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
                                onClick={() => setActiveTab('password')}
                            >
                                <FaLock /> Change Password
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="profile-content">
                        {success && <div className="alert success">{success}</div>}
                        {error && <div className="alert error">{error}</div>}

                        {activeTab === 'profile' && (
                            <div className="profile-section">
                                <h3>Profile Settings</h3>
                                <form onSubmit={handleProfileSubmit}>
                                    <div className="form-grid">
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
                                                    placeholder="Your full name"
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
                                                    disabled
                                                    placeholder="Your email"
                                                />
                                            </div>
                                            <small className="form-hint">Email cannot be changed</small>
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
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <div className="input-wrapper">
                                                <FaMapMarkerAlt className="input-icon" />
                                                <select
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select City</option>
                                                    {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'].map(city => (
                                                        <option key={city} value={city}>{city}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="profile-section">
                                <h3>Change Password</h3>
                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Current Password</label>
                                        <div className="input-wrapper">
                                            <FaLock className="input-icon" />
                                            <input
                                                type="password"
                                                id="currentPassword"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter current password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <div className="input-wrapper">
                                            <FaLock className="input-icon" />
                                            <input
                                                type="password"
                                                id="newPassword"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter new password"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        <div className="input-wrapper">
                                            <FaLock className="input-icon" />
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Confirm new password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        <FaLock /> {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Danger Zone */}
                        <div className="danger-zone">
                            <h3>Danger Zone</h3>
                            <p>Once you delete your account, there is no going back. Please be certain.</p>
                            <button className="btn btn-danger" onClick={handleDeleteAccount}>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;
