const { Live, User } = require('../models');

global.temporaryTitles = global.temporaryTitles || {};

exports.setStreamTitle = async (req, res) => {
  try {
    const { tytul } = req.body;

    if (!tytul) {
      return res.status(400).json({ error: 'Brak tytułu transmisji.' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Nie znaleziono użytkownika.' });
    }

    if (!user.klucz) {
      return res.status(400).json({ error: 'Brak przypisanego klucza.' });
    }

    global.temporaryTitles[user.klucz] = tytul;
    console.log(`Tytuł zapisany dla klucza ${user.klucz}: ${tytul}`);

    res.json({
      message: 'Tytuł transmisji został zapisany.',
      key: user.klucz, 
    });
  } catch (error) {
    console.error('Błąd ustawiania tytułu transmisji:', error);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera.' });
  }
};

exports.getLive = async (req, res) => {
  try {
    const userId = req.params.userId;

    const live = await Live.findOne({
      where: { 
        uzytkownik_id: userId,  
        data_zakonczenia: null 
      }
    });

    if (!live) {
      return res.status(404).json({ message: 'Nie znaleziono aktywnej transmisji.' });
    }

    const user = await User.findByPk(live.uzytkownik_id);

    if (!user) {
      return res.status(404).json({ message: 'Nie znaleziono autora transmisji.' });
    }

    const hlsUrl = `http://localhost:8000/live/${user.klucz}/index.m3u8`;

    res.status(200).json({
      id: live.id,
      tytul: live.tytul,
      data_rozpoczecia: live.data_rozpoczecia,
      uzytkownik_id: live.uzytkownik_id,
      hlsUrl: hlsUrl,
    });
  } catch (error) {
    console.error('Błąd pobierania transmisji:', error);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera.' });
  }
};


exports.getAllLives = async (req, res) => {
  try {
    const lives = await Live.findAll();
    res.status(200).json(lives);
  } catch (error) {
    console.error('Błąd pobierania listy transmisji:', error);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera.' });
  }
};

exports.deleteLive = async (req, res) => {
  try {
    const live = await Live.findOne({ where: { id: req.params.id } });

    if (!live) {
      return res.status(404).json({ message: 'Transmisja nie została znaleziona.' });
    }

    
    await live.update({ data_zakonczenia: new Date() });
    await live.destroy();

    res.status(200).json({ message: 'Transmisja została usunięta.' });
  } catch (error) {
    console.error('Błąd usuwania transmisji:', error);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera.' });
  }
};

exports.checkActiveStream = async (req, res) => {
  try {
    const userId = req.user.id;

    const live = await Live.findOne({
      where: {
        uzytkownik_id: userId,
        data_zakonczenia: null,  
      },
    });

    if (live) {
      return res.status(400).json({ error: 'Masz już aktywną transmisję. Zakończ ją przed rozpoczęciem nowej.' });
    }

    return res.status(200).json({ message: 'Brak aktywnej transmisji.' });
  } catch (error) {
    console.error('Błąd podczas sprawdzania aktywnej transmisji:', error);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera.' });
  }
};
