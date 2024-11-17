'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('transmisja', 'data_zakonczenia', {
      type: Sequelize.DATE,
      allowNull: true,  
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('transmisja', 'data_zakonczenia', {
      type: Sequelize.DATE,
      allowNull: false,  
    });
  }
};
