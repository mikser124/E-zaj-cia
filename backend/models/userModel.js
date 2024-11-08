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
  },

  findById: (id) => {
    return db.query('SELECT * FROM uzytkownik WHERE id = ?', [id]);
  },

  updateUser: async (id, updates) => { 
    const fields = [];
    const values = [];
  
    if (updates.photo) {
      fields.push('photo = ?');
      values.push(updates.photo);
    }
    if (updates.banner) {
      fields.push('banner = ?');
      values.push(updates.banner);
    }
    if (updates.opis) {
      fields.push('opis = ?');
      values.push(updates.opis);
    }
    
    values.push(id);
    const sql = `UPDATE uzytkownik SET ${fields.join(', ')} WHERE id = ?`;

    return db.query(sql, values);
  }
};

module.exports = User;
