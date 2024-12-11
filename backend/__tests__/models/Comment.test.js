const db = require('../../models');

describe('Comment Model', () => {
  beforeEach(async () => {
    // Synchronizacja bazy danych
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Zamknięcie połączenia
    await db.sequelize.close();
  });

  test('should create a comment with default values', async () => {
    // Tworzenie użytkownika
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    // Tworzenie rekordu
    const record = await db.Record.create({
      tytul: 'Test Title',
      url: 'https://example.com/video.mp4',
      uzytkownik_id: user.id,
    });

    // Tworzenie komentarza
    const comment = await db.Comment.create({
      tresc: 'This is a great video!',
      uzytkownik_id: user.id,
      nagranie_id: record.id,
    });

    expect(comment.id).toBeDefined();
    expect(comment.tresc).toBe('This is a great video!');
    expect(comment.data_komentarza).toBeDefined();
    expect(comment.uzytkownik_id).toBe(user.id);
    expect(comment.nagranie_id).toBe(record.id);
  });

  test('should associate correctly with User and Record models', async () => {
    // Tworzenie użytkownika
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    // Tworzenie rekordu
    const record = await db.Record.create({
      tytul: 'Test Title',
      url: 'https://example.com/video.mp4',
      uzytkownik_id: user.id,
    });

    // Tworzenie komentarza
    const comment = await db.Comment.create({
      tresc: 'This is a great video!',
      uzytkownik_id: user.id,
      nagranie_id: record.id,
    });

    // Pobieranie użytkownika z komentarza
    const associatedUser = await comment.getUser();
    // Pobieranie rekordu z komentarza
    const associatedRecord = await comment.getRecord();

    expect(associatedUser).toBeDefined();
    expect(associatedUser.imie).toBe('Jan');
    expect(associatedRecord).toBeDefined();
    expect(associatedRecord.tytul).toBe('Test Title');
  });

  test('should enforce required fields', async () => {
    // Tworzenie użytkownika
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    // Tworzenie rekordu
    const record = await db.Record.create({
      tytul: 'Test Title',
      url: 'https://example.com/video.mp4',
      uzytkownik_id: user.id,
    });

    // Test z brakującą treścią komentarza
    await expect(
      db.Comment.create({
        uzytkownik_id: user.id,
        nagranie_id: record.id,
      })
    ).rejects.toThrow();

    // Test z brakującym użytkownikiem
    await expect(
      db.Comment.create({
        tresc: 'This is a great video!',
        nagranie_id: record.id,
      })
    ).rejects.toThrow();

    // Test z brakującym nagraniem
    await expect(
      db.Comment.create({
        tresc: 'This is a great video!',
        uzytkownik_id: user.id,
      })
    ).rejects.toThrow();
  });
});
