// controllers/recordController.js

const Record = require('../models/recordModel');

const getRecordingById = async (req, res) => {
  try {
    const { id } = req.params;  
    const [record] = await Record.findById(id);

    if (!record) {
      return res.status(404).json({ message: 'Nagranie nie znalezione' });
    }

    return res.json(record);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania nagrania' });
  }
};

const deleteRecording = async (req, res) => {
  try {
    const { id } = req.params;  
    const result = await Record.deleteById(id); 

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nagranie nie znalezione' });
    }

    return res.status(200).json({ message: 'Nagranie zostało usunięte' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania nagrania' });
  }
};

module.exports = {
  getRecordingById,
  deleteRecording,
};
