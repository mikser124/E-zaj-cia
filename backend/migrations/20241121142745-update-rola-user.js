'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id, typ_uzytkownika, liczba_punktow FROM uzytkownik', { type: Sequelize.QueryTypes.SELECT });
    
    for (const user of users) {
      const rola = user.typ_uzytkownika === 'prowadzacy' 
        ? 'Ekspert'  
        : (user.liczba_punktow <= 300 ? 'Początkujący' 
          : (user.liczba_punktow <= 700 ? 'Praktyk' : 'Ekspert')); 

      await queryInterface.sequelize.query(
        `UPDATE uzytkownik SET rola = :rola WHERE id = :id`,
        {
          replacements: { rola, id: user.id },
        }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.sequelize.query(
      `UPDATE uzytkownik SET rola = 'Początkujący'`
    );
  }
};
