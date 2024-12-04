'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('nagranie', {
      id: { 
        type: Sequelize.INTEGER,  
        primaryKey: true,         
        autoIncrement: true,      
        allowNull: false,         
      },
      tytul: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      opis: { 
        type: Sequelize.STRING 
      },
      url: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      data_nagrania: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      },
      liczba_polubien: { 
        type: Sequelize.INTEGER, 
        defaultValue: 0 
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
        references: {
          model: 'Kategoria', 
          key: 'id',
        },
        allowNull: true,
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
    await queryInterface.dropTable('nagranie');
  }
};
