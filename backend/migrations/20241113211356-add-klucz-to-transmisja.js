'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('transmisja', 'klucz', {
      type: Sequelize.STRING,
      allowNull: false, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transmisja', 'klucz');
  },
};
