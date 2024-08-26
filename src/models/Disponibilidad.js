const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Servicio = require('../models/Services');

const Disponibilidad = sequelize.define('Disponibilidad', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  servicio_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Servicios',
      key: 'id',
    },
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: false,
  tableName: 'disponibilidades',
});

Disponibilidad.belongsTo(Servicio, { foreignKey: 'servicio_id', as: 'servicio' });

module.exports = Disponibilidad;
