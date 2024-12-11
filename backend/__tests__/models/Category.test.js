const db = require('../../models');

describe('Category Model', () => {
  beforeEach(async () => {
    // Synchronizacja bazy danych
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Zamknięcie połączenia
    await db.sequelize.close();
  });

  test('should create a category with default values', async () => {
    const category = await db.Category.create({
      nazwa: 'Education',
    });

    expect(category.id).toBeDefined();
    expect(category.nazwa).toBe('Education');
  });

  test('should associate correctly with Record and Live models', async () => {
    // Tworzenie kategorii
    const category = await db.Category.create({
      nazwa: 'Education',
    });
  
    // Tworzenie użytkownika
    const user = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });
  
    // Tworzenie rekordu przypisanego do kategorii
    const record = await db.Record.create({
      tytul: 'Test Title',
      url: 'https://example.com/video.mp4',
      uzytkownik_id: user.id,  // Dodajemy id użytkownika
      kategoria_id: category.id,
    });
  
    // Tworzenie transmisji przypisanej do kategorii
    const live = await db.Live.create({
      tytul: 'Test Live Stream',
      data_rozpoczecia: new Date(), // Dodajemy datę rozpoczęcia
      uzytkownik_id: user.id,       // Dodajemy id użytkownika
      kategoria_id: category.id,    // Przypisujemy kategorię
    });
  
    const associatedRecord = await category.getRecords();
    const associatedLive = await category.getLives();
  
    expect(associatedRecord).toHaveLength(1);
    expect(associatedRecord[0].tytul).toBe('Test Title');
    expect(associatedLive).toHaveLength(1);
    expect(associatedLive[0].tytul).toBe('Test Live Stream');
    expect(associatedLive[0].data_rozpoczecia).toBeDefined();  // Sprawdzamy, czy data rozpoczęcia istnieje
    expect(associatedLive[0].uzytkownik_id).toBe(user.id);    // Sprawdzamy przypisanie użytkownika
  });
  
  

  test('should enforce required fields', async () => {
    await expect(
      db.Category.create({
        // Brak nazwy kategorii
      })
    ).rejects.toThrow();
  });

  test('should enforce unique category names', async () => {
    await db.Category.create({
      nazwa: 'Education',
    });

    await expect(
      db.Category.create({
        nazwa: 'Education', // Powtarzająca się nazwa
      })
    ).rejects.toThrow();
  });
});
