'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Change TEXT to LONGTEXT for larger base64 images
        await queryInterface.changeColumn('users', 'profile_photo', {
            type: Sequelize.TEXT('long'),
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('users', 'profile_photo', {
            type: Sequelize.TEXT,
            allowNull: true
        });
    }
};
