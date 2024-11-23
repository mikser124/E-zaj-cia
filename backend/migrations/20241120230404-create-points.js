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
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'uzytkownik',
          key: 'klucz',
        },
        onDelete: 'CASCADE',
      },
      prowadzacy_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'uzytkownik',
          key: 'klucz',
        },
        onDelete: 'SET NULL',
      },
      liczba_punktow: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('punkty');
  },
};
