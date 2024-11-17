const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

exports.register = async (req, res) => {
  const { imie, nazwisko, email, haslo, typ_uzytkownika = 'student' } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(pollub\.edu\.pl|pollub\.pl)$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Adres e-mail musi mieć domenę pollub.edu.pl lub pollub.pl' });
  }
  console.log(Object.keys(User));
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Użytkownik o podanym emailu już istnieje.' });
    }

    const hashedPassword = await bcrypt.hash(haslo, 10);
    const klucz = uuidv4();

    await User.create({
      imie,
      nazwisko,
      email,
      haslo: hashedPassword,
      typ_uzytkownika,
      klucz: typ_uzytkownika === 'prowadzący' ? klucz : null,
    });

    res.status(201).json({ message: 'Rejestracja przebiegła pomyślnie.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas rejestracji użytkownika.' });
  }
};

exports.login = async (req, res) => { 
  const { email, haslo } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Nieprawidłowy email lub hasło.' });
    }

    const validPassword = await bcrypt.compare(haslo, user.haslo);
    if (!validPassword) {
      return res.status(400).json({ message: 'Nieprawidłowy email lub hasło.' });
    }

    const token = jwt.sign(
      { id: user.id, imie: user.imie, typ_uzytkownika: user.typ_uzytkownika },
      process.env.JWT_SECRET,
      { expiresIn: '5h' }
    );

    res.status(200).json({
      message: 'Logowanie przebiegło pomyślnie.',
      token,
      id: user.id,
      imie: user.imie,
      typ_uzytkownika: user.typ_uzytkownika
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas logowania.' });
  }
};
