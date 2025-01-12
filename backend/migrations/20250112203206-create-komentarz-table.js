'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('komentarz', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tresc: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_komentarza: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true,
      },
      uzytkownik_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'uzytkownik',
          key: 'id',
        },
      },
      nagranie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'nagranie',
          key: 'id',
        },
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
    await queryInterface.dropTable('komentarz');
  }
};
