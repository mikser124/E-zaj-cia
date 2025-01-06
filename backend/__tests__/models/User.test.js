const { Sequelize } = require('sequelize');
const defineUserModel = require('../../models/User');

describe('User Model', () => {
  let sequelize;
  let User;

  beforeAll(() => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false }); 
    User = defineUserModel(sequelize); 
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should create a user with default values', async () => {
    const user = await User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    expect(user.id).toBeDefined(); 
    expect(user.typ_uzytkownika).toBe('student'); 
    expect(user.liczba_polubien).toBe(0);
    expect(user.liczba_punktow).toBe(0);
    expect(user.rola).toBe('Początkujący'); 
    expect(user.klucz).toBeDefined(); 
  });

  test('should calculate role based on liczba_punktow', async () => {
    const user = await User.create({
      imie: 'Anna',
      nazwisko: 'Nowak',
      email: 'anna.nowak@example.com',
      haslo: 'sekret',
      liczba_punktow: 500, 
    });

    expect(user.rola).toBe('Praktyk'); 
  });

  test('should update role when liczba_punktow changes', async () => {
    const user = await User.create({
      imie: 'Piotr',
      nazwisko: 'Nowy',
      email: 'piotr.nowy@example.com',
      haslo: 'passw0rd',
      liczba_punktow: 200,
    });

    expect(user.rola).toBe('Początkujący');

    user.liczba_punktow = 800; 
    await user.save();

    expect(user.rola).toBe('Ekspert');
  });

  test('should handle unique constraints for email and klucz', async () => {
    await User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });
  
    await expect(
      User.create({
        imie: 'Adam',
        nazwisko: 'Nowak',
        email: 'jan.kowalski@example.com', 
        haslo: 'innehaslo',
      })
    ).rejects.toThrow(/Validation error/); 
  });

  test('should validate required fields', async () => {
    await expect(
      User.create({
        nazwisko: 'Bez Imienia',
        email: 'brak.imienia@example.com',
        haslo: 'haslobrak',
      })
    ).rejects.toThrow(/notNull/);
  });

  test('should use default typ_uzytkownika if not provided', async () => {
    const user = await User.create({
      imie: 'Ewa',
      nazwisko: 'Zalewska',
      email: 'ewa.zalewska@example.com',
      haslo: 'hasloewa',
    });

    expect(user.typ_uzytkownika).toBe('student');
  });

  test('should calculate default rola for prowadzący', async () => {
    const user = await User.create({
      imie: 'Prowadzący',
      nazwisko: 'Zalewski',
      email: 'prowadzacy@example.com',
      haslo: 'prowadzacyhaslo',
      typ_uzytkownika: 'prowadzacy',
    });

    expect(user.rola).toBe('Ekspert');
  });

  test('should allow null for optional fields', async () => {
    const user = await User.create({
      imie: 'Adam',
      nazwisko: 'Nowak',
      email: 'adam.nowak@example.com',
      haslo: 'hasloadam',
    });

    expect(user.photo).toBeNull();
    expect(user.banner).toBeNull();
    expect(user.opis).toBeNull();
  });

  test('should enforce unique klucz if not provided', async () => {
    const user1 = await User.create({
      imie: 'User1',
      nazwisko: 'Test',
      email: 'user1@example.com',
      haslo: 'haslo1',
    });

    const user2 = await User.create({
      imie: 'User2',
      nazwisko: 'Test',
      email: 'user2@example.com',
      haslo: 'haslo2',
    });

    expect(user1.klucz).not.toBe(user2.klucz);
  });
});