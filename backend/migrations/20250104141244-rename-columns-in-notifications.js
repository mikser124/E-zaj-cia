'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Zmiana nazwy kolumny 'uzytkownik_id' na 'user_id'
    await queryInterface.renameColumn('powiadomienie', 'uzytkownik_id', 'user_id');
    
    // Zmiana nazwy kolumny 'wiadomosc_id' na 'message_id'
    await queryInterface.renameColumn('powiadomienie', 'wiadomosc_id', 'message_id');
  },

  down: async (queryInterface, Sequelize) => {
    // Cofnięcie zmian - zmiana nazw kolumn na 'uzytkownik_id' i 'wiadomosc_id'
    await queryInterface.renameColumn('powiadomienie', 'user_id', 'uzytkownik_id');
    await queryInterface.renameColumn('powiadomienie', 'message_id', 'wiadomosc_id');
  },
};
