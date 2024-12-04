'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('komentarz', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tresc: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_komentarza: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
      nagranie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'nagranie',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('komentarz');
  }
};
