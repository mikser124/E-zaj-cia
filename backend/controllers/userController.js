const { User } = require('../models');
const { Record } = require('../models');
const { Category } = require('../models');
const { Op } = require('sequelize');

const path = require('path');
const fs = require('fs');

exports.getUserProfile = async (req, res) => {
  const profileId = parseInt(req.params.id, 10);

  try {

    const user = await User.findByPk(profileId, {
      attributes: ['id', 'imie', 'nazwisko', 'email', 'photo', 'banner', 'opis', 'typ_uzytkownika', 'klucz', 'rola', 'liczba_polubien', 'liczba_punktow'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony.' });
    }

    const { id, imie, nazwisko, email, photo, banner, opis, typ_uzytkownika, klucz, rola, liczba_polubien, liczba_punktow } = user;
    const nagrania = await Record.findAll({ where: { uzytkownik_id: profileId } });


    res.status(200).json({ id, imie, nazwisko, email, photo, banner, opis, typ_uzytkownika, nagrania, klucz, rola, liczba_polubien, liczba_punktow});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd przy pobieraniu użytkownika.' });
  }
};



exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const profileId = parseInt(req.params.id);

  if (userId !== profileId) {
    return res.status(403).json({ message: 'Nie masz uprawnień do edycji tego profilu.' });
  }

  const { opis } = req.body;
  const updates = { opis };

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony.' });
    }

    await user.update(updates);
    res.status(200).json({ message: 'Profil użytkownika został pomyślnie zaktualizowany.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji profilu użytkownika.' });
  }
};

const deleteOldFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Błąd usuwania starego pliku:', err);
    });
  }
};


const uploadFile = (file, userId, type) => {
  const folder = type === 'photo' ? 'photos' : 'banners';
  const filePath = `uploads/${folder}/${userId}-${Date.now()}-${file.name}`; 
  
  return new Promise((resolve, reject) => {
    file.mv(path.join(__dirname, '..', filePath), (err) => {
      if (err) {
        console.error('Błąd podczas zapisywania pliku:', err);
        return reject(err); 
      }
      resolve(filePath);  
    });
  });
};

exports.updatePhoto = async (req, res) => {
  const userId = req.user.id;

  if (!req.files || !req.files.photo) {
    return res.status(400).json({ message: 'Brak pliku do przesłania.' });
  }

  const photo = req.files.photo;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony.' });
    }

    if (user.photo) {
      deleteOldFile(path.join(__dirname, '..', user.photo));
    }

    const newPhotoPath = await uploadFile(photo, userId, 'photo'); 

    await User.update({ photo: newPhotoPath }, { where: { id: userId } });

    res.status(200).json({ message: 'Zdjęcie profilowe użytkownika zaktualizowane.', photo: newPhotoPath });
  } catch (error) {
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji zdjęcia profilowego użytkownika.' });
  }
};


exports.updateBanner = async (req, res) => {
  const userId = req.user.id;


  if (!req.files || !req.files.banner) {
    return res.status(400).json({ message: 'Brak pliku do przesłania.' });
  }

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony.' });
    }

    if (user.banner) {
      deleteOldFile(path.join(__dirname, '..', user.banner));
    }

    const bannerFile = req.files.banner; 
    const newBannerPath = await uploadFile(bannerFile, userId, 'banner');  
    
    await User.update({ banner: newBannerPath }, { where: { id: userId } });

    res.status(200).json({ message: 'Baner użytkownika zaktualizowany.', banner: newBannerPath });
  } catch (error) {
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji banera użytkownika.' });
  }
};


exports.addRecord = async (req, res) => {
  const userId = req.user.id; 

  const { title, description, url, kategoria_id  } = req.body; 
  const category = await Category.findByPk(kategoria_id);
  if (!category) {
    return res.status(404).json({ message: 'Kategoria o podanym ID nie istnieje.' });
  }
  try {
      await Record.create({
          tytul: title,
          opis: description,
          url,
          data_nagrania: new Date(),
          liczba_polubien: 0,
          uzytkownik_id: userId,
          kategoria_id: kategoria_id,
      }); 

      res.status(201).json({ message: 'Nagranie zostało dodane do profilu użytkownika.', url });
  } catch (error) {
      console.error('Błąd podczas zapisu nagrania w bazie danych:', error);
      res.status(500).json({ message: 'Błąd podczas zapisywania nagrania.' });
  }
};


exports.updateDescription = async (req, res) => {
  const userId = req.user.id; 
  const { opis } = req.body;
  try {
    await User.update({ opis }, { where: { id: userId } });
    res.status(200).json({ message: 'Opis zaktualizowany', opis });
  } catch (error) {
    console.error('Błąd podczas aktualizacji opisu profila:', error);
    res.status(500).json({ message: 'Błąd podczas aktualizacji opisu profila' });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id; 
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: currentUserId }, 
      },
      attributes: ['id', 'imie', 'nazwisko'],
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error('Błąd przy pobieraniu użytkowników:', error);
    res.status(500).json({ error: 'Nie udało się pobrać użytkowników' });
  }
};