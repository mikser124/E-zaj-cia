const db = require('../../models');

describe('Record Model', () => {
  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test('should create a record with default values', async () => {
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

    expect(record.id).toBeDefined();
    expect(record.tytul).toBe('Test Title');
    expect(record.url).toBe('https://example.com/video.mp4');
    expect(record.data_nagrania).toBeDefined();
    expect(record.liczba_polubien).toBe(0);
    expect(record.uzytkownik_id).toBe(user.id);
    expect(record.kategoria_id).toBeFalsy(); 
  });

  test('should associate correctly with User, Comment, and Like models', async () => {
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

    const comment = await db.Comment.create({
      tresc: 'Great video!',
      uzytkownik_id: user.id, 
      nagranie_id: record.id,
    });

    const like = await db.Like.create({
      uzytkownik_id: user.id,
      nagranie_id: record.id,
    });

    const comments = await record.getComments();
    const likes = await record.getLikes();

    expect(comments).toHaveLength(1);
    expect(comments[0].tresc).toBe('Great video!');
    expect(likes).toHaveLength(1);
    expect(likes[0].uzytkownik_id).toBe(user.id);
  });

  test('should handle optional category association', async () => {
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });
  
    const category = await db.Category.create({
      nazwa: 'Education', 
    });
  
    const record = await db.Record.create({
      tytul: 'Test Title',
      url: 'https://example.com/video.mp4',
      uzytkownik_id: user.id, 
      kategoria_id: category.id, 
    });
  
    const associatedCategory = await record.getCategory();
    expect(associatedCategory).toBeDefined();
    expect(associatedCategory.nazwa).toBe('Education'); 
  });
  

  test('should enforce required fields', async () => {
    await expect(
      db.Record.create({
        opis: 'Description without title and URL',
      })
    ).rejects.toThrow();
  });
});
