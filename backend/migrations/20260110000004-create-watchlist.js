'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('watchlist', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            movie_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            poster_path: {
                type: Sequelize.STRING,
                allowNull: true
            },
            release_date: {
                type: Sequelize.STRING,
                allowNull: true
            },
            vote_average: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            overview: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('watchlist', 'watched'),
                defaultValue: 'watchlist'
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Add unique constraint for user_id + movie_id
        await queryInterface.addIndex('watchlist', ['user_id', 'movie_id'], {
            unique: true,
            name: 'unique_user_movie'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('watchlist');
    }
};
