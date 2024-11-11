const bcrypt = require('bcrypt');
const User = require('./models/User'); 

async function registerUser() {
    const imie = 'Tomasz';           
    const nazwisko = 'Kowalski';   
    const email = 't.kowalski@pollub.pl'; 
    const typ_uzytkownika = 'prowadzacy';      
    const haslo = '12345';

 
    const hashedPassword = await bcrypt.hash(haslo, 10);


    await User.create(imie, nazwisko, email, hashedPassword, typ_uzytkownika);
    console.log('Użytkownik został dodany do bazy danych');
}

registerUser().catch(console.error);
