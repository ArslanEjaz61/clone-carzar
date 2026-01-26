import axios from 'axios';

// Base API URL
// Fallback to production URL if hostname matches, otherwise localhost
const API_URL = import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'carzarpk.store'
        ? 'https://carzarpk.store/api'
        : 'http://localhost:5000/api');

export const BASE_URL = API_URL.replace('/api', '');

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/updateprofile', data),
    updatePassword: (data) => api.put('/auth/updatepassword', data),
    updateAvatar: (formData) => api.put('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
    resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password }),
    deleteAccount: () => api.delete('/auth/deleteaccount')
};

// ============================================
// CARS API
// ============================================
export const carsAPI = {
    // Get all cars with filters
    getAll: (params) => api.get('/cars', { params }),

    // Get single car by ID or slug
    getById: (id) => api.get(`/cars/${id}`),

    // Get featured cars
    getFeatured: (params) => api.get('/cars/featured', { params }),

    // Get recent cars
    getRecent: (params) => api.get('/cars/recent', { params }),

    // Get stats by make
    getStatsByMake: () => api.get('/cars/stats/makes'),

    // Get stats by city
    getStatsByCity: () => api.get('/cars/stats/cities'),

    // Create new car listing
    create: (carData) => api.post('/cars', carData),

    // Create with images (multipart form)
    createWithImages: (formData) => api.post('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Update car listing
    update: (id, carData) => api.put(`/cars/${id}`, carData),

    // Update with images
    updateWithImages: (id, formData) => api.put(`/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Delete car listing
    delete: (id) => api.delete(`/cars/${id}`),

    // Toggle active status
    toggleActive: (id) => api.put(`/cars/${id}/toggle-active`),

    // Remove image from car
    removeImage: (carId, imageId) => api.delete(`/cars/${carId}/images/${imageId}`)
};

// ============================================
// USERS API
// ============================================
export const usersAPI = {
    // Get user profile
    getProfile: (id) => api.get(`/users/${id}`),

    // Get user's listings
    getUserListings: (id, params) => api.get(`/users/${id}/listings`, { params }),

    // Get current user's listings
    getMyListings: (params) => api.get('/users/me/listings', { params }),

    // Get current user's favorites
    getFavorites: (params) => api.get('/users/me/favorites', { params }),

    // Add car to favorites
    addFavorite: (carId) => api.post(`/users/favorites/${carId}`),

    // Remove car from favorites
    removeFavorite: (carId) => api.delete(`/users/favorites/${carId}`),

    // Check if car is in favorites
    checkFavorite: (carId) => api.get(`/users/favorites/check/${carId}`),

    // Get current user's stats
    getMyStats: () => api.get('/users/me/stats')
};

// ============================================
// PARTS API
// ============================================
export const partsAPI = {
    // Get all parts with filters
    getAll: (params) => api.get('/parts', { params }),

    // Get single part
    getById: (id) => api.get(`/parts/${id}`),

    // Get featured parts
    getFeatured: (params) => api.get('/parts/featured', { params }),

    // Create part listing
    create: (partData) => api.post('/parts', partData),

    // Create part with image upload
    createWithImages: (formData) => api.post('/parts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Update part
    update: (id, partData) => api.put(`/parts/${id}`, partData),

    // Delete part
    delete: (id) => api.delete(`/parts/${id}`)
};

// ============================================
// ADMIN API
// ============================================
export const adminAPI = {
    // Dashboard stats
    getStats: () => api.get('/admin/stats'),

    // Users management
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),

    // Cars management
    getCars: (params) => api.get('/admin/cars', { params }),
    toggleCarFeatured: (id) => api.put(`/admin/cars/${id}/featured`),
    toggleCarActive: (id) => api.put(`/admin/cars/${id}/active`),
    deleteCar: (id) => api.delete(`/admin/cars/${id}`),

    // Parts management
    getParts: (params) => api.get('/admin/parts', { params }),
    deletePart: (id) => api.delete(`/admin/parts/${id}`)
};

// ============================================
// ORDERS API
// ============================================
export const ordersAPI = {
    // Create new order
    create: (orderData) => api.post('/orders', orderData),

    // Get all orders (admin)
    getAll: (params) => api.get('/orders', { params }),

    // Get single order
    getById: (id) => api.get(`/orders/${id}`),

    // Get order by order number
    getByNumber: (orderNumber) => api.get(`/orders/number/${orderNumber}`),

    // Update order status
    updateStatus: (id, statusData) => api.patch(`/orders/${id}/status`, statusData),

    // Delete order
    delete: (id) => api.delete(`/orders/${id}`),

    // Get order stats
    getStats: () => api.get('/orders/stats/summary')
};

// Export the api instance for custom requests
export default api;

