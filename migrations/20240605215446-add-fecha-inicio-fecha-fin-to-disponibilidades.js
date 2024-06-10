'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('disponibilidades', 'fecha_inicio', {
      type: Sequelize.DATE,
      allowNull: true, // Permitir valores nulos inicialmente
    });
    await queryInterface.addColumn('disponibilidades', 'fecha_fin', {
      type: Sequelize.DATE,
      allowNull: true, // Permitir valores nulos inicialmente
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('disponibilidades', 'fecha_inicio');
    await queryInterface.removeColumn('disponibilidades', 'fecha_fin');
  }
};
