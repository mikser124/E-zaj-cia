'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('transmisja', 'url');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('transmisja', 'url', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
