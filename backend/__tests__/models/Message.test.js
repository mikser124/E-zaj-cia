const db = require('../../models');

describe('Message Model', () => {
  beforeEach(async () => {
    // Synchronizacja bazy danych przed każdym testem
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Zamknięcie połączenia z bazą po testach
    await db.sequelize.close();
  });

  test('should create a message with required fields', async () => {
    const sender = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const receiver = await db.User.create({
      imie: 'Anna',
      nazwisko: 'Nowak',
      email: 'anna.nowak@example.com',
      haslo: 'tajnehaslo',
    });

    const message = await db.Message.create({
      from_id: sender.id,
      to_id: receiver.id,
      content: 'Hello, how are you?',
    });

    expect(message.id).toBeDefined();
    expect(message.from_id).toBe(sender.id);
    expect(message.to_id).toBe(receiver.id);
    expect(message.content).toBe('Hello, how are you?');
    expect(message.read).toBe(false);  // Domyślna wartość dla 'read' to false
  });

  test('should enforce required fields', async () => {
    const sender = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const receiver = await db.User.create({
      imie: 'Anna',
      nazwisko: 'Nowak',
      email: 'anna.nowak@example.com',
      haslo: 'tajnehaslo',
    });

    // Brak 'content' powinien spowodować błąd
    await expect(
      db.Message.create({
        from_id: sender.id,
        to_id: receiver.id,
      })
    ).rejects.toThrow('notNull Violation: Message.content cannot be null');  // Zmieniona nazwa modelu

    // Brak 'from_id' powinien spowodować błąd
    await expect(
      db.Message.create({
        to_id: receiver.id,
        content: 'Test message',
      })
    ).rejects.toThrow('notNull Violation: Message.from_id cannot be null');  // Zmieniona nazwa modelu

    // Brak 'to_id' powinien spowodować błąd
    await expect(
      db.Message.create({
        from_id: sender.id,
        content: 'Test message',
      })
    ).rejects.toThrow('notNull Violation: Message.to_id cannot be null');  // Zmieniona nazwa modelu
  });

  test('should set default value for "read" to false', async () => {
    const sender = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const receiver = await db.User.create({
      imie: 'Anna',
      nazwisko: 'Nowak',
      email: 'anna.nowak@example.com',
      haslo: 'tajnehaslo',
    });

    const message = await db.Message.create({
      from_id: sender.id,
      to_id: receiver.id,
      content: 'Test message',
    });

    expect(message.read).toBe(false);  // Domyślnie 'read' powinno być ustawione na false
  });

  test('should establish associations with User model', async () => {
    const sender = await db.User.create({
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      haslo: 'tajnehaslo',
    });

    const receiver = await db.User.create({
      imie: 'Anna',
      nazwisko: 'Nowak',
      email: 'anna.nowak@example.com',
      haslo: 'tajnehaslo',
    });

    const message = await db.Message.create({
      from_id: sender.id,
      to_id: receiver.id,
      content: 'Hello, how are you?',
    });

    // Sprawdzanie relacji "sender"
    const senderMessage = await message.getSender();
    expect(senderMessage.id).toBe(sender.id);

    // Sprawdzanie relacji "receiver"
    const receiverMessage = await message.getReceiver();
    expect(receiverMessage.id).toBe(receiver.id);
  });
});
