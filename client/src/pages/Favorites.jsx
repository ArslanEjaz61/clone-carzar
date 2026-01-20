import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import CarCard from '../components/CarCard/CarCard';
import { FaHeart } from 'react-icons/fa';
import './Favorites.css';

const Favorites = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchFavorites();
    }, [isAuthenticated]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await usersAPI.getFavorites();
            if (response.data?.data) {
                setFavorites(response.data.data);
            }
        } catch (error) {
            console.log('Using demo data');
            setFavorites([]);
        }
        setLoading(false);
    };

    const handleRemoveFavorite = async (carId) => {
        try {
            await usersAPI.removeFavorite(carId);
            setFavorites(prev => prev.filter(car => car._id !== carId));
        } catch (error) {
            alert('Failed to remove from favorites');
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <main className="favorites-page">
            <div className="container">
                <div className="page-header">
                    <div className="page-header-left">
                        <h1><FaHeart className="heart-icon" /> My Favorites</h1>
                        <p className="results-count">{favorites.length} saved cars</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your favorites...</p>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="empty-state">
                        <FaHeart className="empty-icon" />
                        <h3>No favorites yet</h3>
                        <p>Save cars you like to easily find them later.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/used-cars')}>
                            Browse Cars
                        </button>
                    </div>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map(car => (
                            <CarCard
                                key={car._id}
                                car={car}
                                onFavoriteToggle={() => handleRemoveFavorite(car._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Favorites;
