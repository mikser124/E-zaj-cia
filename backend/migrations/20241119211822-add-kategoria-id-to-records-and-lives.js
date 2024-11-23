'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('nagranie', 'kategoria_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Kategoria',
        key: 'id',
      },
      allowNull: true,
    });

    await queryInterface.addColumn('transmisja', 'kategoria_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Kategoria',
        key: 'id',
      },
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('nagranie', 'kategoria_id');
    await queryInterface.removeColumn('transmisja', 'kategoria_id');
  }
};
