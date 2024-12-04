'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */

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
        allowNull: false 
      },
      nazwisko: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      email: { 
        type: Sequelize.STRING, 
        unique: true, 
        allowNull: false 
      },
      haslo: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      photo: { 
        type: Sequelize.STRING 
      },  
      banner: { 
        type: Sequelize.STRING 
      },
      opis: { 
        type: Sequelize.STRING 
      },
      typ_uzytkownika: { 
        type: Sequelize.STRING, 
        defaultValue: 'student' 
      },
      liczba_polubien: { 
        type: Sequelize.INTEGER, 
        defaultValue: 0 
      },
      liczba_punktow: { 
        type: Sequelize.INTEGER, 
        defaultValue: 0 
      },
      klucz: { 
        type: Sequelize.STRING, 
        allowNull: true, 
        unique: true, 
        defaultValue: uuidv4 
      },
      rola: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Początkujący',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('uzytkownik');
  }
};
