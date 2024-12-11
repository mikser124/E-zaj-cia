const db = require('../../models');

describe('Record Model', () => {
  beforeEach(async () => {
    // Synchronizacja bazy danych
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Zamknięcie połączenia
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
    expect(record.kategoria_id).toBeFalsy(); // Akceptuje null lub undefined
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
      uzytkownik_id: user.id, // Dodanie wymaganej wartości
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
    // Tworzenie użytkownika
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });
  
    // Tworzenie kategorii
    const category = await db.Category.create({
      nazwa: 'Education', // Poprawne pole nazwy kategorii
    });
  
    // Tworzenie rekordu z przypisaną kategorią
    const record = await db.Record.create({
      tytul: 'Test Title',
      url: 'https://example.com/video.mp4',
      uzytkownik_id: user.id, // Poprawny użytkownik
      kategoria_id: category.id, // Przypisana kategoria
    });
  
    // Sprawdzanie przypisania kategorii
    const associatedCategory = await record.getCategory();
    expect(associatedCategory).toBeDefined();
    expect(associatedCategory.nazwa).toBe('Education'); // Poprawne odniesienie do pola
  });
  

  test('should enforce required fields', async () => {
    await expect(
      db.Record.create({
        opis: 'Description without title and URL',
      })
    ).rejects.toThrow();
  });
});
