'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('punkty', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      uzytkownik_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      prowadzacy_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      liczba_punktow: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      data_przyznania: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('punkty');
  }
};
