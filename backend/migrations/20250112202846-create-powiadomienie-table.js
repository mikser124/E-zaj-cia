'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('powiadomienie', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'uzytkownik',
          key: 'id',
        },
      },
      message_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'wiadomosc',
          key: 'id',
        },
      },
      content: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('powiadomienie');
  }
};
