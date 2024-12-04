'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transmisja', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tytul: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_rozpoczecia: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      data_zakonczenia: {
        type: Sequelize.DATE,
        allowNull: true,
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
      kategoria_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Kategoria',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transmisja');
  }
};
