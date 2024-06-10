'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('disponibilidades', 'fecha_hora');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('disponibilidades', 'fecha_hora', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};
