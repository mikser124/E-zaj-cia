'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('powiadomienie', 'message_id', 'wiadomosc_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('powiadomienie', 'wiadomosc_id', 'message_id');
  },
};
