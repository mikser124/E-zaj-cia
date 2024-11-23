'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('uzytkownik', 'liczba_punktow', {
      type: Sequelize.INTEGER,
      defaultValue: 0, 
      allowNull: false,
    });

    await queryInterface.addColumn('uzytkownik', 'rola', {
      type: Sequelize.STRING,
      allowNull: false, 
      defaultValue: 'Początkujący', 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('uzytkownik', 'liczba_punktow');

    await queryInterface.removeColumn('uzytkownik', 'rola');
  }
};
