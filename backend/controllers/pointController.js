const { Points, User } = require('../models');

const givePoints = async (req, res) => {
    try {
      const { uzytkownik_id, liczba_punktow } = req.body;
      const prowadzacy_id = req.params.prowadzacy_id; 
  
      if (req.user.id !== parseInt(prowadzacy_id) || req.user.typ_uzytkownika !== 'prowadzacy') {
        return res.status(403).json({ message: 'Tylko prowadzący tego live może nadawać punkty.' });
      }
  
      if (req.user.id === parseInt(uzytkownik_id)) {
        return res.status(403).json({ message: 'Prowadzący nie może przyznać punktów samemu sobie.' });
      }

      const student = await User.findByPk(uzytkownik_id);
      if (!student) {
        return res.status(404).json({ message: 'Użytkownik nie znaleziony.' });
      }
  
      const pointsRecord = await Points.create({
        uzytkownik_id,
        prowadzacy_id,
        liczba_punktow,
        data_przyznania: new Date()
      });
  
      const updatedPoints = student.liczba_punktow + parseInt(liczba_punktow);
      let rola = 'Początkujący';
  
      if (updatedPoints <= 300) {
        rola = 'Początkujący';
      } else if (updatedPoints <= 700) {
        rola = 'Praktyk';
      } else {
        rola = 'Ekspert';
      }
  
      await student.update({
        liczba_punktow: updatedPoints,
        rola: rola,
      });

      return res.status(200).json({
        message: 'Punkty zostały nadane i rola użytkownika została zaktualizowana.',
        data: pointsRecord,
        user: {
          id: student.id,
          imie: student.imie,
          nazwisko: student.nazwisko,
          email: student.email,
          liczba_punktow: student.liczba_punktow,
          rola: student.rola  
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Błąd serwera.', error });
    }
  };
  

module.exports = {
  givePoints,
};
