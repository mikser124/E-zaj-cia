const db = require('../config/database');

const User = {
  create: (imie, nazwisko, email, haslo) => {
    return db.query(
      'INSERT INTO uzytkownik (imie, nazwisko, email, haslo) VALUES (?, ?, ?, ?)', 
      [imie, nazwisko, email, haslo]
    );
  },

  findByEmail: (email) => {
    return db.query('SELECT * FROM uzytkownik WHERE email = ?', [email]);
  }
};

module.exports = User;
