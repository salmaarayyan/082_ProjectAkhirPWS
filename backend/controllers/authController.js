const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Token } = require('../models');
const { logActivity } = require('../utils/activityLogger');
require('dotenv').config();

// Register user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, profile_photo } = req.body;

        // Check if username exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email: email || null,
            password: hashedPassword,
            role: 'user',
            profile_photo: profile_photo || null
        });

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Register admin
const registerAdmin = async (req, res) => {
    try {
        const { username, email, password, profile_photo } = req.body;

        // Check if username exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin',
            profile_photo: profile_photo || null
        });

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Admin registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register admin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if user has 'user' role
        if (user.role !== 'user') {
            return res.status(403).json({ message: 'Access denied. This account is not a user account.' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log activity
        await logActivity(user.id, 'LOGIN', 'User logged in');

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile_photo: user.profile_photo
            }
        });
    } catch (error) {
        console.error('Login user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login admin
const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if user has 'admin' role
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. This account is not an admin account.' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile_photo: user.profile_photo
            }
        });
    } catch (error) {
        console.error('Login admin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login (generic - untuk backward compatibility)
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log activity (only for users, not admins)
        if (user.role === 'user') {
            await logActivity(user.id, 'LOGIN', 'User logged in');
        }

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile_photo: user.profile_photo
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get profile
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

// Logout
const logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            // Calculate token expiration
            const decoded = jwt.decode(token);
            const expiresAt = new Date(decoded.exp * 1000);

            // Add to blacklist
            await Token.create({
                token,
                user_id: req.user.id,
                expires_at: expiresAt
            });
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    registerUser,
    registerAdmin,
    loginUser,
    loginAdmin,
    login,
    getProfile,
    logout
};
