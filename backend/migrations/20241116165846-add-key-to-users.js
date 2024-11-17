'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('uzytkownik', 'klucz', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4, 
    });

    await queryInterface.removeColumn('transmisja', 'klucz');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('uzytkownik', 'klucz');

    await queryInterface.addColumn('transmisja', 'klucz', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
