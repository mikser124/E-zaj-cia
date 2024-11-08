const User = require('../models/userModel');
const Record = require('../models/recordModel');
const path = require('path');
const fs = require('fs');
const bucket = require('../config/firebase'); 

exports.getProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const [user] = await User.findById(userId, {attributes: {exlude: ['haslo']}});
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { imie, nazwisko, email, photo, banner, opis, typ_uzytkownika } = user[0];
    const recordings = await Record.findByUserId(userId); 
    res.status(200).json({ imie, nazwisko, email, photo, banner, opis, typ_uzytkownika, recordings }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.params.id;

  if (userId !== profileId) {
    return res.status(403).json({ message: 'Nie masz uprawnień do edycji tego profilu.' });
  }

  const { opis } = req.body;
  const updates = { opis };

  try {
    await User.updateProfile(userId, updates);
    res.status(200).json({ message: 'Profil został pomyślnie zaktualizowany.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji profilu.' });
  }
};

const deleteOldFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Błąd usuwania starego pliku:', err);
    });
  }
};

exports.updatePhoto = async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: 'Brak pliku do przesłania.' });
  }

  const photoPath = `uploads/photos/${userId}-${Date.now()}-${req.file.originalname}`;

  try {
    const [user] = await User.findById(userId);
    deleteOldFile(user[0].photo); 

    fs.writeFile(photoPath, req.file.buffer, async (err) => {
      if (err) return res.status(500).json({ message: 'Błąd zapisu pliku.' });

      const updates = { photo: photoPath };
      await User.updateProfile(userId, updates);
      res.status(200).json({ message: 'Zdjęcie profilowe zaktualizowane.', photo: photoPath });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji zdjęcia profilowego.' });
  }
};

exports.updateBanner = async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: 'Brak pliku do przesłania.' });
  }

  const bannerPath = `uploads/banners/${userId}-${Date.now()}-${req.file.originalname}`;

  try {
    const [user] = await User.findById(userId);
    deleteOldFile(user[0].banner); 
    fs.writeFile(bannerPath, req.file.buffer, async (err) => {
      if (err) return res.status(500).json({ message: 'Błąd zapisu pliku.' });

      const updates = { banner: bannerPath };
      await User.updateProfile(userId, updates);
      res.status(200).json({ message: 'Baner zaktualizowany.', banner: bannerPath });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji banera.' });
  }
};


exports.getRecordsByUserId = async (req, res) => {
  const userId = req.params.id; 

  try {
    const records = await Record.findByUserId(userId); 
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania nagrań.' });
  }
};



exports.addRecord = async (req, res) => {
  console.log('Received data:', req.body);
  const userId = req.user.id; // Zakładając, że masz odpowiednie middleware do uwierzytelniania

  const { title, description, url } = req.body; // Odbieramy dane z klienta

  try {
      await Record.create({
          tytul: title,
          opis: description,
          url,
          data_nagrania: new Date(),
          liczba_polubien: 0,
          uzytkownik_id: userId,
      });

      res.status(201).json({ message: 'Nagranie zostało dodane.', url });
  } catch (error) {
      console.error('Błąd podczas zapisu nagrania w bazie danych:', error);
      res.status(500).json({ message: 'Wystąpił błąd podczas zapisywania nagrania.' });
  }
};
