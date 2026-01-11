const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Activity logs
router.get('/activity-logs', adminController.getActivityLogs);

// Profile
router.get('/profile', adminController.getProfile);

// User management
router.get('/users', adminController.getUsers);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Popular movies (saved by users)
router.get('/popular-movies', adminController.getPopularMovies);

module.exports = router;
