const { ActivityLog } = require('../models');

const logActivity = async (userId, action, details = null) => {
    try {
        await ActivityLog.create({
            user_id: userId,
            action,
            details
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

module.exports = { logActivity };
