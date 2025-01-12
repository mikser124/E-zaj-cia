'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transmisja', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      },
      kategoria_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'kategoria',
          key: 'id',
        },
        allowNull: true,
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
    await queryInterface.dropTable('transmisja');
  }
};
