const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];


  if (!token || !token.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Nieautoryzowany dostęp: brak tokenu.' });
  }

  const tokenValue = token.split(' ')[1]; 

  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Błąd weryfikacji tokena:', err);
      return res.status(401).json({ message: 'Nieprawidłowy token.' });
    }
    req.user = decoded;

    next();
  });
};

module.exports = authMiddleware;
