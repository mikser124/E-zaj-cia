const { Live } = require('../models');
const { v4: uuidv4 } = require('uuid'); 

exports.createLive = async (req, res) => {
  try {
    const { tytul, data_rozpoczecia, data_zakonczenia } = req.body;

    console.log('Request body:', req.body);
    console.log('User from token:', req.user);

    if (!tytul || !data_rozpoczecia || !data_zakonczenia) {
      return res.status(400).json({ error: "Brakuje wymaganych danych" });
    }


    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    const { id: uzytkownik_id } = req.user; 

    const klucz = uuidv4();


    const newLive = await Live.create({
      tytul,  
      data_rozpoczecia,
      data_zakonczenia,
      uzytkownik_id, 
      klucz,
    });

    const rtmpUrl = `rtmp://localhost:1935/live/${klucz}`;
    const hlsUrl = `http://localhost:8000/media/live/${klucz}/index.m3u8`;

    return res.status(201).json({
      live: newLive,
      klucz: newLive.klucz,
      rtmpUrl,
      hlsUrl
    });

  } catch (error) {
    console.error("Error creating live stream:", error);  
    return res.status(500).json({ error: error.message });
  }
};


  exports.checkLiveKey = async (req, res) => {
    try {
      const { klucz } = req.params;
  
      const live = await Live.findOne({
        where: { klucz: klucz },
      });
  
      if (!live) {
        return res.status(404).json({ message: 'Nieprawidłowy klucz transmisji' });
      }
  
      res.status(200).json({ message: 'Prawidłowy klucz. Transmisja może zostać rozpoczęta.' });
    } catch (error) {
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

    res.status(200).json(live);
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

    await live.destroy();
    res.status(200).json({ message: 'Transmisja usunięta' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
