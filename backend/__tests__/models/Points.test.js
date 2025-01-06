const db = require('../../models');

describe('Points Model', () => {
  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test('should create points with required fields', async () => {
    const student = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const instructor = await db.User.create({
      imie: 'Anna',
      nazwisko: 'Nowak',
      email: 'anna.nowak@example.com',
      haslo: 'tajnehaslo',
    });

    const points = await db.Points.create({
      uzytkownik_id: student.id,
      prowadzacy_id: instructor.id,
      liczba_punktow: 10,
    });

    expect(points.id).toBeDefined();
    expect(points.uzytkownik_id).toBe(student.id);
    expect(points.prowadzacy_id).toBe(instructor.id);
    expect(points.liczba_punktow).toBe(10);
    expect(points.data_przyznania).toBeDefined(); 
  });

  test('should enforce required fields', async () => {
    const student = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const instructor = await db.User.create({
      imie: 'Anna',
      nazwisko: 'Nowak',
      email: 'anna.nowak@example.com',
      haslo: 'tajnehaslo',
    });

    // Brak 'liczba_punktow' powinien spowodować błąd
    await expect(
      db.Points.create({
        uzytkownik_id: student.id,
        prowadzacy_id: instructor.id,
      })
    ).rejects.toThrow('notNull Violation: Points.liczba_punktow cannot be null');

    // Brak 'uzytkownik_id' powinien spowodować błąd
    await expect(
      db.Points.create({
        prowadzacy_id: instructor.id,
        liczba_punktow: 10,
      })
    ).rejects.toThrow('notNull Violation: Points.uzytkownik_id cannot be null');

    // Brak 'prowadzacy_id' powinien spowodować błąd
    await expect(
      db.Points.create({
        uzytkownik_id: student.id,
        liczba_punktow: 10,
      })
    ).rejects.toThrow('notNull Violation: Points.prowadzacy_id cannot be null');
  });

  test('should establish associations with User model', async () => {
    const student = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const instructor = await db.User.create({
      imie: 'Anna',
      nazwisko: 'Nowak',
      email: 'anna.nowak@example.com',
      haslo: 'tajnehaslo',
    });

    const points = await db.Points.create({
      uzytkownik_id: student.id,
      prowadzacy_id: instructor.id,
      liczba_punktow: 10,
    });

    const studentPoints = await points.getStudent();
    expect(studentPoints.id).toBe(student.id);

    const instructorPoints = await points.getProwadzacy();
    expect(instructorPoints.id).toBe(instructor.id);
  });

  test('should set default value for "data_przyznania" to current date', async () => {
    const student = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const instructor = await db.User.create({
      imie: 'Anna',
      nazwisko: 'Nowak',
      email: 'anna.nowak@example.com',
      haslo: 'tajnehaslo',
    });

    const points = await db.Points.create({
      uzytkownik_id: student.id,
      prowadzacy_id: instructor.id,
      liczba_punktow: 10,
    });

    expect(points.data_przyznania).toBeDefined();
    expect(new Date(points.data_przyznania).toLocaleDateString()).toBe(new Date().toLocaleDateString()); 
  });
});
