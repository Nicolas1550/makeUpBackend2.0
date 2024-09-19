const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const UserServices = sequelize.define('UserServices', {
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // nombre de la tabla
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  ServicioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'servicios', // nombre de la tabla
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: false,
  tableName: 'userservices', // Asegúrate de que coincida con tu tabla
});

module.exports = UserServices;
