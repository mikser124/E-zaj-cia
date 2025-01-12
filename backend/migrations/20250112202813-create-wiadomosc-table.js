'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wiadomosc', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      from_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'uzytkownik',
          key: 'id',
        },
      },
      to_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'uzytkownik',
          key: 'id',
        },
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('wiadomosc');
  }
};
