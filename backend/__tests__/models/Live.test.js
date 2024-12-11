const db = require('../../models');

describe('Live Model', () => {
  beforeEach(async () => {
    // Synchronizacja bazy danych przed każdym testem
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Zamknięcie połączenia z bazą po testach
    await db.sequelize.close();
  });

  test('should create live broadcast with required fields', async () => {
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const category = await db.Category.create({
      nazwa: 'Technologia',
    });

    const live = await db.Live.create({
      tytul: 'Nowoczesne technologie',
      data_rozpoczecia: new Date(),
      uzytkownik_id: user.id,
      kategoria_id: category.id,
    });

    expect(live.tytul).toBe('Nowoczesne technologie');
    expect(live.data_rozpoczecia).toBeDefined();
    expect(live.uzytkownik_id).toBe(user.id);
    expect(live.kategoria_id).toBe(category.id);
  });

  test('should enforce required fields', async () => {
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const category = await db.Category.create({
      nazwa: 'Technologia',
    });

    // Brak 'tytul' powinien spowodować błąd
    await expect(
      db.Live.create({
        data_rozpoczecia: new Date(),
        uzytkownik_id: user.id,
        kategoria_id: category.id,
      })
    ).rejects.toThrow('notNull Violation: Live.tytul cannot be null');

    // Brak 'data_rozpoczecia' powinien spowodować błąd
    await expect(
      db.Live.create({
        tytul: 'Nowoczesne technologie',
        uzytkownik_id: user.id,
        kategoria_id: category.id,
      })
    ).rejects.toThrow('notNull Violation: Live.data_rozpoczecia cannot be null');

    // Brak 'uzytkownik_id' powinien spowodować błąd
    await expect(
      db.Live.create({
        tytul: 'Nowoczesne technologie',
        data_rozpoczecia: new Date(),
        kategoria_id: category.id,
      })
    ).rejects.toThrow('notNull Violation: Live.uzytkownik_id cannot be null');
  });

  test('should establish associations with User and Category models', async () => {
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const category = await db.Category.create({
      nazwa: 'Technologia',
    });

    const live = await db.Live.create({
      tytul: 'Nowoczesne technologie',
      data_rozpoczecia: new Date(),
      uzytkownik_id: user.id,
      kategoria_id: category.id,
    });

    // Sprawdzanie relacji 'user'
    const liveUser = await live.getUser();
    expect(liveUser.id).toBe(user.id);

    // Sprawdzanie relacji 'category'
    const liveCategory = await live.getCategory();
    expect(liveCategory.id).toBe(category.id);
  });

  test('should allow null for kategoria_id', async () => {
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const live = await db.Live.create({
      tytul: 'Nowoczesne technologie',
      data_rozpoczecia: new Date(),
      uzytkownik_id: user.id,
      kategoria_id: null,
    });

    expect(live.kategoria_id).toBeNull();
  });
});
