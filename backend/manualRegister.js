const bcrypt = require('bcrypt');
const { User } = require('./models'); 

async function registerUser() {
    const imie = 'Michal';           
    const nazwisko = 'Nowak';   
    const email = 'm.nowak@pollub.pl'; 
    const typ_uzytkownika = 'prowadzacy';      
    const haslo = 'mnowak';
    const rola = 'Ekspert';
    const hashedPassword = await bcrypt.hash(haslo, 10);

    await User.create({
        imie: imie,
        nazwisko: nazwisko,
        email: email,
        haslo: hashedPassword,
        typ_uzytkownika: typ_uzytkownika,
        rola: rola
    });

    console.log('Użytkownik został dodany do bazy danych');
}

registerUser().catch(console.error);