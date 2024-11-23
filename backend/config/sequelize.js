const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('projekt_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  define: {
    freezeTableName: true, 
  },
});

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
