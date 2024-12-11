const { Sequelize, DataTypes } = require('sequelize');
const defineUserModel = require('../../models/User');
const { v4: uuidv4 } = require('uuid');

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
      haslo: 'zmienione',
      liczba_punktow: 200,
    });

    expect(user.rola).toBe('Początkujący'); // Początkowo liczba punktów = 200

    user.liczba_punktow = 800; // Zmieniamy liczbę punktów
    await user.save();

    expect(user.rola).toBe('Ekspert'); // Rola zmieniona na Ekspert
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
  

  test('should set default klucz if not provided', async () => {
    const user = await User.create({
      imie: 'Ewa',
      nazwisko: 'Zalewska',
      email: 'ewa.zalewska@example.com',
      haslo: 'hasloewa',
    });

    expect(user.klucz).toBeDefined();
    expect(user.klucz).toMatch(/^[0-9a-fA-F-]{36}$/); 
  });

  test('should associate correctly with other models', async () => {
    const Record = sequelize.define('Record', {
      name: { type: DataTypes.STRING },
    });

    const Comment = sequelize.define('Comment', {
      content: { type: DataTypes.STRING },
    });

    User.hasMany(Record, { foreignKey: 'uzytkownik_id' });
    User.hasMany(Comment, { foreignKey: 'uzytkownik_id' });

    await sequelize.sync({ force: true });

    const user = await User.create({
      imie: 'Marek',
      nazwisko: 'Baryła',
      email: 'marek.baryla@example.com',
      haslo: 'haslomarek',
    });

    const record = await Record.create({ name: 'Rekord 1', uzytkownik_id: user.id });
    const comment = await Comment.create({ content: 'Komentarz 1', uzytkownik_id: user.id });

    const records = await user.getRecords();
    const comments = await user.getComments();

    expect(records).toHaveLength(1);
    expect(records[0].name).toBe('Rekord 1');
    expect(comments).toHaveLength(1);
    expect(comments[0].content).toBe('Komentarz 1');
  });
});
