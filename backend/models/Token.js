const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Token = sequelize.define('Token', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'tokens',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Token.associate = (models) => {
        Token.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Token;
};
