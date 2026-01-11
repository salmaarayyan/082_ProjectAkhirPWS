const { User, Watchlist } = require('../models');
const TmdbApiService = require('../services/tmdbApi');
const { logActivity } = require('../utils/activityLogger');

const tmdbApi = new TmdbApiService();

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user watchlist
const getWatchlist = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = { user_id: req.user.id };
        if (status) {
            where.status = status;
        }

        const { count, rows: watchlist } = await Watchlist.findAndCountAll({
            where,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            watchlist,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get watchlist error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add movie to watchlist
const addToWatchlist = async (req, res) => {
    try {
        const { movie_id, title, poster_path, release_date, vote_average, overview } = req.body;

        // Check if already in watchlist
        const existing = await Watchlist.findOne({
            where: { user_id: req.user.id, movie_id }
        });

        if (existing) {
            return res.status(400).json({ message: 'Movie already in watchlist' });
        }

        const watchlistItem = await Watchlist.create({
            user_id: req.user.id,
            movie_id,
            title,
            poster_path,
            release_date,
            vote_average,
            overview,
            status: 'watchlist'
        });

        // Log activity
        await logActivity(req.user.id, 'ADD_WATCHLIST', `Added "${title}" to watchlist`);

        res.status(201).json({
            message: 'Movie added to watchlist',
            watchlistItem
        });
    } catch (error) {
        console.error('Add to watchlist error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove movie from watchlist
const removeFromWatchlist = async (req, res) => {
    try {
        const { movieId } = req.params;

        const deleted = await Watchlist.destroy({
            where: { user_id: req.user.id, movie_id: movieId }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Movie not found in watchlist' });
        }

        // Log activity
        await logActivity(req.user.id, 'REMOVE_WATCHLIST', 'Removed a movie from watchlist');

        res.json({ message: 'Movie removed from watchlist' });
    } catch (error) {
        console.error('Remove from watchlist error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update watchlist status (mark as watched)
const updateWatchlistStatus = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { status } = req.body;

        const watchlistItem = await Watchlist.findOne({
            where: { user_id: req.user.id, movie_id: movieId }
        });

        if (!watchlistItem) {
            return res.status(404).json({ message: 'Movie not found in watchlist' });
        }

        await watchlistItem.update({ status });

        // Log activity
        if (status === 'watched') {
            await logActivity(req.user.id, 'WATCHED', `Marked "${watchlistItem.title}" as watched`);
        }

        res.json({
            message: 'Watchlist status updated',
            watchlistItem
        });
    } catch (error) {
        console.error('Update watchlist status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user stats
const getStats = async (req, res) => {
    try {
        const watchlistCount = await Watchlist.count({
            where: { user_id: req.user.id, status: 'watchlist' }
        });

        const watchedCount = await Watchlist.count({
            where: { user_id: req.user.id, status: 'watched' }
        });

        const totalCount = await Watchlist.count({
            where: { user_id: req.user.id }
        });

        res.json({
            totalMovies: totalCount,
            watchlist: watchlistCount,
            watched: watchedCount
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Search movies from TMDB
const searchMovies = async (req, res) => {
    try {
        const { query, page } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const results = await tmdbApi.searchMovies(query, page);
        res.json(results);
    } catch (error) {
        console.error('Search movies error:', error);
        res.status(500).json({ message: 'Failed to search movies' });
    }
};

// Get popular movies from TMDB
const getPopularMovies = async (req, res) => {
    try {
        const { page } = req.query;
        const results = await tmdbApi.getPopularMovies(page);
        res.json(results);
    } catch (error) {
        console.error('Get popular movies error:', error);
        res.status(500).json({ message: 'Failed to get popular movies' });
    }
};

// Get now playing movies from TMDB
const getNowPlayingMovies = async (req, res) => {
    try {
        const { page } = req.query;
        const results = await tmdbApi.getNowPlayingMovies(page);
        res.json(results);
    } catch (error) {
        console.error('Get now playing movies error:', error);
        res.status(500).json({ message: 'Failed to get now playing movies' });
    }
};

// Get movie details from TMDB
const getMovieDetails = async (req, res) => {
    try {
        const { movieId } = req.params;
        const movie = await tmdbApi.getMovieDetails(movieId);

        // Check if movie is in user's watchlist
        const watchlistItem = await Watchlist.findOne({
            where: { user_id: req.user.id, movie_id: movieId }
        });

        res.json({
            ...movie,
            inWatchlist: !!watchlistItem,
            watchlistStatus: watchlistItem?.status || null
        });
    } catch (error) {
        console.error('Get movie details error:', error);
        res.status(500).json({ message: 'Failed to get movie details' });
    }
};

// Update profile photo
const updateProfilePhoto = async (req, res) => {
    try {
        const { profile_photo } = req.body;

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ profile_photo });

        res.json({
            message: 'Profile photo updated',
            user: {
                id: user.id,
                username: user.username,
                profile_photo: user.profile_photo
            }
        });
    } catch (error) {
        console.error('Update profile photo error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getProfile,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistStatus,
    getStats,
    searchMovies,
    getPopularMovies,
    getNowPlayingMovies,
    getMovieDetails,
    updateProfilePhoto
};
