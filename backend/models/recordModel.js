// models/recordModel.js

const db = require('../config/database'); 

class Record {
  static async findByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM nagranie WHERE uzytkownik_id = ?', [userId]);
    return rows;
  }

  static async create({ tytul, opis, url, data_nagrania, uzytkownik_id }) {
    const [result] = await db.execute('INSERT INTO nagranie (tytul, opis, url, data_nagrania, uzytkownik_id) VALUES (?, ?, ?, ?, ?)', [tytul, opis, url, data_nagrania, uzytkownik_id]);
    return { id: result.insertId, tytul, opis, url, data_nagrania, uzytkownik_id };
  }
}

module.exports = Record;
