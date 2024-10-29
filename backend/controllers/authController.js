const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { imie, nazwisko, email, haslo } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(pollub\.edu\.pl|pollub\.pl)$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Adres e-mail musi mieć domenę pollub.edu.pl lub pollub.pl' });
  }
  
  const [existingUser] = await User.findByEmail(email);
  if (existingUser.length > 0) {
    return res.status(400).json({ message: 'Użytkownik o podanym emailu już istnieje.' });
  }

  const hashedPassword = await bcrypt.hash(haslo, 10);
  await User.create(imie, nazwisko, email, hashedPassword);
  res.status(201).json({ message: 'Rejestracja przebiegła pomyślnie.' });
};

exports.login = async (req, res) => {
  const { email, haslo } = req.body;

  const [user] = await User.findByEmail(email);
  if (user.length === 0) {
    return res.status(400).json({ message: 'Nieprawidłowy email lub hasło.' });
  }

  const validPassword = await bcrypt.compare(haslo, user[0].haslo);
  if (!validPassword) {
    return res.status(400).json({ message: 'Nieprawidłowy email lub hasło.' });
  }

  res.status(200).json({ message: 'Logowanie przebiegło pomyślnie.', imie: user[0].imie });
};

