const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Watchlist = sequelize.define('Watchlist', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        movie_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        poster_path: {
            type: DataTypes.STRING,
            allowNull: true
        },
        release_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vote_average: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        overview: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('watchlist', 'watched'),
            defaultValue: 'watchlist'
        }
    }, {
        tableName: 'watchlist',
        timestamps: true,
        underscored: true
    });

    Watchlist.associate = (models) => {
        Watchlist.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Watchlist;
};
