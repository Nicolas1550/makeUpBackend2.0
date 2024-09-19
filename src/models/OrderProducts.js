const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const OrderProducts = sequelize.define('OrderProducts', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'OrderProducts',
  indexes: [
    {
      unique: true,
      fields: ['ProductId', 'ProductOrderId'],  // Asegura que no haya duplicación de registros
    },
  ],
});

module.exports = OrderProducts;
