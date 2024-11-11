const { User } = require('../models');
const { Record } = require('../models');
const { Comment } = require('../models');

const addComment = async (req, res) => {
  const { tresc, nagranie_id } = req.body;
  const { id: uzytkownik_id } = req.user; 

  try {
    const record = await Record.findByPk(nagranie_id);
    if (!record) {
      return res.status(404).json({ message: 'Nagranie nie istnieje' });
    }

    const comment = await Comment.create({
      tresc,
      uzytkownik_id,
      nagranie_id,
    });

    return res.status(201).json({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
};

const getComments = async (req, res) => {
    const { nagranie_id } = req.params;
    try {
      const comments = await Comment.findAll({
        where: { nagranie_id }, // Filtrujemy komentarze po nagranie_id
        include: [
          { model: User, attributes: ['imie', 'nazwisko'] } // Możesz dodać informacje o autorze komentarza
        ]
      });
  
      // Odpowiadamy z listą komentarzy
      res.json({ comments });
    } catch (error) {
      console.error('Błąd przy pobieraniu komentarzy:', error);
      res.status(500).json({ error: 'Wystąpił błąd przy pobieraniu komentarzy' });
    }
};



const updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { tresc } = req.body;

  try {
    const comment = await Comment.findByPk(comment_id);
    if (!comment) {
      return res.status(404).json({ message: 'Komentarz nie istnieje' });
    }

    if (comment.uzytkownik_id !== req.user.id) {
      return res.status(403).json({ message: 'Nie masz uprawnień do edycji tego komentarza' });
    }

    comment.tresc = tresc;
    await comment.save();

    return res.status(200).json({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
};

const deleteComment = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const comment = await Comment.findByPk(comment_id);
    if (!comment) {
      return res.status(404).json({ message: 'Komentarz nie istnieje' });
    }

    if (comment.uzytkownik_id !== req.user.id) {
      return res.status(403).json({ message: 'Nie masz uprawnień do usunięcia tego komentarza' });
    }

    await comment.destroy();

    return res.status(200).json({ message: 'Komentarz został usunięty' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
