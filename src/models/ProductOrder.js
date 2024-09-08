const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const ProductOrder = sequelize.define('ProductOrder', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  shipping_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  payment_proof: {  
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = ProductOrder;
