const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Role = require('./Role');
const Servicio = require('./Services'); 

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'users',
});

// Relación muchos a muchos con el modelo Role
User.belongsToMany(Role, { through: 'user_roles', as: 'rolesAssociation', foreignKey: 'userId', otherKey: 'roleId' });

// Relación muchos a muchos con el modelo Servicio
User.belongsToMany(Servicio, { through: 'userservicio', as: 'servicesAssociation', foreignKey: 'userId', otherKey: 'ServicioId' });

module.exports = User;
