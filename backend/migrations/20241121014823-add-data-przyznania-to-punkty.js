'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('punkty', 'data_przyznania', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('punkty', 'data_przyznania');
  }
};

