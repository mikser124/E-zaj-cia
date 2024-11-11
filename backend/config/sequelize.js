// config/sequelize.js
const { Sequelize } = require('sequelize');

// Inicjalizacja połączenia do bazy danych
const sequelize = new Sequelize('projekt_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  define: {
    freezeTableName: true, // Zapewnia, że nazwy tabel nie będą zmieniane
  },
});

// Funkcja do testowania połączenia z bazą danych
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Połączono z bazą danych przez Sequelize');
  } catch (error) {
    console.error('Błąd połączenia:', error);
  }
}

testConnection();

module.exports = sequelize;
