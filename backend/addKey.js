const { User } = require('./models'); 
const { v4: uuidv4 } = require('uuid');

(async () => {
  try {
    console.log('Proces dodawania kluczy dla prowadzących rozpoczety');

    const prowadzacy = await User.findAll({ where: { typ_uzytkownika: 'prowadzący' } });

    if (!prowadzacy.length) {
      console.log('Brak prowadzących do aktualizacji.');
      return;
    }

    for (const user of prowadzacy) {
      if (!user.klucz) {
        const newKey = uuidv4();
        await user.update({ klucz: newKey });
        console.log(`Dodano klucz dla użytkownika ${user.email}: ${newKey}`);
      } else {
        console.log(`Użytkownik ${user.email} już ma klucz: ${user.klucz}`);
      }
    }

    console.log('Proces dodawania kluczy zakończony pomyślnie!');
  } catch (error) {
    console.error('Błąd podczas dodawania kluczy:', error);
  } finally {
    process.exit();
  }
})();
