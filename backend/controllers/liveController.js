const { Live, User } = require('../models');

exports.createLive = async (req, res) => {
  try {
    const { tytul, data_rozpoczecia } = req.body;


    if (!tytul || !data_rozpoczecia) {
      return res.status(400).json({ error: 'Brakuje wymaganych danych' });
    }

    if (!req.user, !req.user.id) {
      return res.status(401).json({ error: 'Brak autoryzacji' });
    }



    const user = await User.findByPk(req.user.id);


    if (!user || user.typ_uzytkownika !== 'prowadzacy') {
      return res.status(403).json({ error: 'Nie masz uprawnień do tej operacji.' });
    }

    if (!user.klucz) {
      return res.status(400).json({ error: 'Nie przypisano klucza do użytkownika.' });
    }

    const newLive = await Live.create({
      tytul,
      data_rozpoczecia,
      uzytkownik_id: user.id,
    });

    const rtmpUrl = `rtmp://localhost:1935/live`;
    const hlsUrl = `http://localhost:8000/live/${user.klucz}/index.m3u8`;

    res.status(201).json({
      live: newLive,
      rtmpUrl,
      hlsUrl,
      userKey: user.klucz,
    });
  } catch (error) {
    console.error('Error creating live stream:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLive = async (req, res) => {
  try {
    const live = await Live.findOne({
      where: { id: req.params.id },
    });

    if (!live) {
      return res.status(404).json({ message: 'Transmisja nie znaleziona' });
    }

    const user = await User.findByPk(live.uzytkownik_id);

    if (!user) {
      return res.status(404).json({ message: 'Nie znaleziono autora transmisji' });
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
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLives = async (req, res) => {
  try {
    const lives = await Live.findAll();
    res.status(200).json(lives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLive = async (req, res) => {
  try {
    const live = await Live.findOne({ where: { id: req.params.id } });

    if (!live) {
      return res.status(404).json({ message: 'Transmisja nie znaleziona' });
    }

    await live.update({ data_zakonczenia: new Date() });

    await live.destroy();
    res.status(200).json({ message: 'Transmisja usunięta' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
