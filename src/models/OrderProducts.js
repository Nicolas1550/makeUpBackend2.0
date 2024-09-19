// models/OrderProducts.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const OrderProducts = sequelize.define('OrderProducts', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'OrderProducts',  // Opcional, pero recomendado para asegurar consistencia en el nombre de la tabla
});

module.exports = OrderProducts;
