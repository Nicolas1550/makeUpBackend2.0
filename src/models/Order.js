// models/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');
const Disponibilidad = require('./Disponibilidad');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  disponibilidad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'disponibilidades',
      key: 'id',
    },
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente',
  },
}, {
  timestamps: true,
  tableName: 'orders',
});

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Order.belongsTo(Disponibilidad, { foreignKey: 'disponibilidad_id', as: 'disponibilidad' });

module.exports = Order;
