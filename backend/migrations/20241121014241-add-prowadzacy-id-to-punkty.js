'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Dodaj kolumnę 'prowadzacy_id' do tabeli 'punkty'
    await queryInterface.addColumn('punkty', 'prowadzacy_id', {
      type: Sequelize.UUID,
      allowNull: false, // Jeśli chcesz, aby ta kolumna była obowiązkowa
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Usuwanie kolumny 'prowadzacy_id' w przypadku rollbacku migracji
    await queryInterface.removeColumn('punkty', 'prowadzacy_id');
  }
};
