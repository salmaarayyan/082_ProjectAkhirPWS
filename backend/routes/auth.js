const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/register/user', authController.registerUser);
router.post('/register/admin', authController.registerAdmin);
router.post('/login', authController.login);
router.post('/login/user', authController.loginUser);
router.post('/login/admin', authController.loginAdmin);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
