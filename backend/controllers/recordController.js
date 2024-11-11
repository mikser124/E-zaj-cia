const { Record } = require('../models/');

// Pobieranie nagrania po ID
const getRecordingById = async (req, res) => {
  try {
    const { id } = req.params;  
    const record = await Record.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: 'Nagranie nie znalezione' });
    }

    return res.json(record);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania nagrania' });
  }
};

// Usuwanie nagrania
const deleteRecording = async (req, res) => {
  try {
    const { id } = req.params;  
    const result = await Record.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: 'Nagranie nie znalezione' });
    }

    return res.status(200).json({ message: 'Nagranie zostało usunięte' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania nagrania' });
  }
};

// Pobieranie wszystkich nagrań
const getAllRecordings = async (req, res) => {
  try {
    const records = await Record.findAll();
    return res.json(records);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania nagrań' });
  }
};

module.exports = {
  getRecordingById,
  deleteRecording,
  getAllRecordings,
};
