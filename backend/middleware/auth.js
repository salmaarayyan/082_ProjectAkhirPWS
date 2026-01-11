const jwt = require('jsonwebtoken');
const { Token } = require('../models');
require('dotenv').config();

// Verify JWT token
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        // Check if token is blacklisted
        const blacklisted = await Token.findOne({ where: { token } });
        if (blacklisted) {
            return res.status(401).json({ message: 'Token has been invalidated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Admin access required' });
    }
};

// Check if user is regular user
const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        return res.status(403).json({ message: 'User access required' });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isUser
};
