module.exports = (sequelize, DataTypes) => {
    return sequelize.define('order_item', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER
        },
    },
        {
            timestamps: false
        }
    )
}