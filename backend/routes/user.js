const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Profile
router.get('/profile', userController.getProfile);
router.put('/profile/photo', userController.updateProfilePhoto);

// TMDB API routes
router.get('/movies/search', userController.searchMovies);
router.get('/movies/popular', userController.getPopularMovies);
router.get('/movies/now-playing', userController.getNowPlayingMovies);
router.get('/movies/:movieId', userController.getMovieDetails);

// Watchlist routes
router.get('/watchlist', userController.getWatchlist);
router.post('/watchlist', userController.addToWatchlist);
router.delete('/watchlist/:movieId', userController.removeFromWatchlist);
router.patch('/watchlist/:movieId', userController.updateWatchlistStatus);

// Stats
router.get('/stats', userController.getStats);

module.exports = router;
