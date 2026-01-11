import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
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

// Handle token expiration (skip redirect on login pages)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const pathname = window.location.pathname;
        const isLoginPage = pathname.includes('/login');
        const isPublicMovies = pathname === '/';
        if ((error.response?.status === 401 || error.response?.status === 403) && !isLoginPage && !isPublicMovies) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    loginUser: (data) => api.post('/auth/login/user', data),
    loginAdmin: (data) => api.post('/auth/login/admin', data),
    registerUser: (data) => api.post('/auth/register/user', data),
    registerAdmin: (data) => api.post('/auth/register/admin', data),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile')
};

// Public API (no auth required)
export const publicAPI = {
    searchMovies: (query, page = 1) => api.get('/public/movies/search', { params: { query, page } }),
    getPopularMovies: (page = 1) => api.get('/public/movies/popular', { params: { page } }),
    getNowPlayingMovies: (page = 1) => api.get('/public/movies/now-playing', { params: { page } }),
    getMovieDetails: (movieId) => api.get(`/public/movies/${movieId}`)
};

// User API
export const userAPI = {
    getProfile: () => api.get('/user/profile'),
    getStats: () => api.get('/user/stats'),
    updateProfilePhoto: (profile_photo) => api.put('/user/profile/photo', { profile_photo }),
    // Movies
    searchMovies: (query, page) => api.get('/user/movies/search', { params: { query, page } }),
    getPopularMovies: (page) => api.get('/user/movies/popular', { params: { page } }),
    getNowPlayingMovies: (page) => api.get('/user/movies/now-playing', { params: { page } }),
    getMovieDetails: (movieId) => api.get(`/user/movies/${movieId}`),
    // Watchlist
    getWatchlist: (params) => api.get('/user/watchlist', { params }),
    addToWatchlist: (movie) => api.post('/user/watchlist', movie),
    removeFromWatchlist: (movieId) => api.delete(`/user/watchlist/${movieId}`),
    updateWatchlistStatus: (movieId, status) => api.patch(`/user/watchlist/${movieId}`, { status })
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getActivityLogs: (limit = 20) => api.get('/admin/activity-logs', { params: { limit } }),
    getProfile: () => api.get('/admin/profile'),
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getPopularMovies: (limit) => api.get('/admin/popular-movies', { params: { limit } })
};

// TMDB Image URL helper
export const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default api;
