const { User, Watchlist, ActivityLog } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Get dashboard stats
const getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.count({
            where: { role: 'user' }
        });

        const totalWatchlistItems = await Watchlist.count();

        const totalWatched = await Watchlist.count({
            where: { status: 'watched' }
        });

        res.json({
            totalUsers,
            totalWatchlistItems,
            totalWatched
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get activity logs
const getActivityLogs = async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const logs = await ActivityLog.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'profile_photo']
            }],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit)
        });

        res.json({ logs });
    } catch (error) {
        console.error('Get activity logs error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all users with watchlist count
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const users = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Get watchlist count for each user
        const usersWithCount = await Promise.all(
            users.rows.map(async (user) => {
                const watchlistCount = await Watchlist.count({
                    where: { user_id: user.id, status: 'watchlist' }
                });
                const watchedCount = await Watchlist.count({
                    where: { user_id: user.id, status: 'watched' }
                });
                return {
                    ...user.toJSON(),
                    watchlistCount,
                    watchedCount
                };
            })
        );

        res.json({
            users: usersWithCount,
            pagination: {
                total: users.count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(users.count / limit)
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ username, email });

        res.json({
            message: 'User updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin user' });
        }

        await user.destroy();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get popular movies (most saved by users)
const getPopularMovies = async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        // Get movies with count of users who saved them
        const popularMovies = await Watchlist.findAll({
            attributes: [
                'movie_id',
                'title',
                'poster_path',
                'release_date',
                'vote_average',
                'overview',
                [sequelize.fn('COUNT', sequelize.col('movie_id')), 'save_count']
            ],
            group: ['movie_id', 'title', 'poster_path', 'release_date', 'vote_average', 'overview'],
            order: [[sequelize.literal('save_count'), 'DESC']],
            limit: parseInt(limit)
        });

        res.json({ movies: popularMovies });
    } catch (error) {
        console.error('Get popular movies error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get admin profile
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

module.exports = {
    getDashboard,
    getActivityLogs,
    getUsers,
    updateUser,
    deleteUser,
    getPopularMovies,
    getProfile
};
