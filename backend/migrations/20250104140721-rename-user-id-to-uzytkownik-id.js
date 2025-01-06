'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Zmieniamy nazwę kolumny 'user_id' na 'uzytkownik_id'
    await queryInterface.renameColumn('powiadomienie', 'user_id', 'uzytkownik_id');
  },

  down: async (queryInterface, Sequelize) => {
    // Cofamy zmiany, zmieniając nazwę z powrotem na 'user_id'
    await queryInterface.renameColumn('powiadomienie', 'uzytkownik_id', 'user_id');
  },
};
