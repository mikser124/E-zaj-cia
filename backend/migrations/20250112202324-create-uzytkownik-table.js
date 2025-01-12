'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('uzytkownik', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      imie: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nazwisko: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      haslo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      banner: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      opis: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      typ_uzytkownika: {
        type: Sequelize.STRING,
        defaultValue: 'student',
      },
      liczba_polubien: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      liczba_punktow: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      klucz: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        defaultValue: Sequelize.literal('uuid()'),
      },
      rola: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Początkujący',
        get() {
          if (this.getDataValue('typ_uzytkownika') === 'prowadzacy') {
            return 'Ekspert';
          }
          const punkty = this.getDataValue('liczba_punktow') || 0;
          if (punkty <= 300) return 'Początkujący';
          if (punkty <= 700) return 'Praktyk';
          return 'Ekspert';
        }
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
    await queryInterface.dropTable('uzytkownik');
  }
};
