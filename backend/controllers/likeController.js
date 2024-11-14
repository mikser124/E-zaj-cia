const { Like, Record, User } = require("../models");

exports.toggleLike = async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  try {
    const found = await Like.findOne({
      where: { uzytkownik_id: UserId, nagranie_id: PostId },
    });

    if (!found) {
      await Like.create({ uzytkownik_id: UserId, nagranie_id: PostId });

      await Record.increment('liczba_polubien', { where: { id: PostId } });

      await User.increment('liczba_polubien', { where: { id: UserId } });

      return res.json({ liked: true });
    } else {
      await Like.destroy({
        where: { uzytkownik_id: UserId, nagranie_id: PostId },
      });

      await Record.decrement('liczba_polubien', { where: { id: PostId } });

      await User.decrement('liczba_polubien', { where: { id: UserId } });

      return res.json({ liked: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Wystąpił błąd przy dodawaniu/Usuwaniu polubienia." });
  }
};
