const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public TMDB routes (no auth)
router.get('/movies/search', userController.searchMovies);
router.get('/movies/popular', userController.getPopularMovies);
router.get('/movies/now-playing', userController.getNowPlayingMovies);
router.get('/movies/:movieId', userController.getMovieDetails);

module.exports = router;
