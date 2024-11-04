const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');

exports.getProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const [user] = await User.findById(userId);
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony.' });
    }

    const { imie, nazwisko, email, photo, banner, opis } = user[0];
    res.status(200).json({ imie, nazwisko, email, photo, banner, opis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania profilu.' });
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
    deleteOldFile(user[0].photo); // Usunięcie starego zdjęcia profilowego

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
    deleteOldFile(user[0].banner); // Usunięcie starego banera

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
