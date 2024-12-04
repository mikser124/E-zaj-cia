'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('punkty', {
      id: {
        type: Sequelize.UUID, 
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      uzytkownik_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'uzytkownik', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      prowadzacy_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'uzytkownik',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('punkty');
  }
};
