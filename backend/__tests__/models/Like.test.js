const db = require('../../models');

describe('Like Model', () => {
    beforeEach(async () => {
      await db.sequelize.sync({ force: true });
    });
  
    afterAll(async () => {
      await db.sequelize.close();
    });
  
    test('should create a like without any additional fields', async () => {
      const user = await db.User.create({
        imie: 'Jan',
        nazwisko: 'Kowalski',
        email: 'jan.kowalski@example.com',
        haslo: 'tajnehaslo',
      });
  
      const record = await db.Record.create({
        tytul: 'Test Title',
        url: 'https://example.com/video.mp4',
        uzytkownik_id: user.id,
      });
  
      const like = await db.Like.create({
        uzytkownik_id: user.id,
        nagranie_id: record.id,
      });
  
      expect(like.id).toBeDefined();
      expect(like.uzytkownik_id).toBe(user.id);
      expect(like.nagranie_id).toBe(record.id);
    });
  
    test('should toggle like correctly', async () => {
      const user = await db.User.create({
        imie: 'Jan',
        nazwisko: 'Kowalski',
        email: 'jan.kowalski@example.com',
        haslo: 'tajnehaslo',
      });
  
      const record = await db.Record.create({
        tytul: 'Test Title',
        url: 'https://example.com/video.mp4',
        uzytkownik_id: user.id,
      });
  
      await db.Like.create({
        uzytkownik_id: user.id,
        nagranie_id: record.id,
      });
  
      let like = await db.Like.findOne({
        where: { uzytkownik_id: user.id, nagranie_id: record.id }
      });
      expect(like).toBeDefined();
  
      await like.destroy();
  
      like = await db.Like.findOne({
        where: { uzytkownik_id: user.id, nagranie_id: record.id }
      });
      expect(like).toBeNull();
  
      await db.Like.create({
        uzytkownik_id: user.id,
        nagranie_id: record.id,
      });
  
      like = await db.Like.findOne({
        where: { uzytkownik_id: user.id, nagranie_id: record.id }
      });
      expect(like).toBeDefined();
    });
  });
  