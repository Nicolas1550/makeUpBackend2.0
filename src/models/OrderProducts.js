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
});

module.exports = OrderProducts;
