'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Usuń istniejące klucze obce w tabeli 'wiadomosc'
    await queryInterface.removeConstraint('wiadomosc', 'wiadomosc_ibfk_1');
    await queryInterface.removeConstraint('wiadomosc', 'wiadomosc_ibfk_2');

    // Dodaj klucze obce z onDelete: 'CASCADE'
    await queryInterface.addConstraint('wiadomosc', {
      fields: ['from_id'],
      type: 'foreign key',
      name: 'wiadomosc_ibfk_1', // Możesz zachować tę nazwę lub zmienić na inną
      references: {
        table: 'uzytkownik',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('wiadomosc', {
      fields: ['to_id'],
      type: 'foreign key',
      name: 'wiadomosc_ibfk_2', // Możesz zachować tę nazwę lub zmienić na inną
      references: {
        table: 'uzytkownik',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Przywróć poprzednie klucze obce bez CASCADE
    await queryInterface.removeConstraint('wiadomosc', 'wiadomosc_ibfk_1');
    await queryInterface.removeConstraint('wiadomosc', 'wiadomosc_ibfk_2');

    await queryInterface.addConstraint('wiadomosc', {
      fields: ['from_id'],
      type: 'foreign key',
      name: 'wiadomosc_ibfk_1', // Przywrócenie starej nazwy
      references: {
        table: 'uzytkownik',
        field: 'id',
      },
      onDelete: 'SET NULL', // Możesz dostosować według wymagań
    });

    await queryInterface.addConstraint('wiadomosc', {
      fields: ['to_id'],
      type: 'foreign key',
      name: 'wiadomosc_ibfk_2', // Przywrócenie starej nazwy
      references: {
        table: 'uzytkownik',
        field: 'id',
      },
      onDelete: 'SET NULL', // Możesz dostosować według wymagań
    });
  },
};
