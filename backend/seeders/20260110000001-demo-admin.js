'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await queryInterface.bulkInsert('users', [{
            username: 'admin',
            email: 'admin@moviewatchlist.com',
            password: hashedPassword,
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
        }], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', { username: 'admin' }, {});
    }
};
