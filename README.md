Przed przejściem do wykonywania kroków instrukcji uruchomienia aplikacji, obowiązuje posiadanie na komputerze poniższych narzędzi:
- Node.js 16.20.2 (LTS);
- XAMPP Control Panel v3.3.0;
- FFmpeg wersji 7.1, folder ffmpeg po domyślnej instalacji ma się znaleźć bezpośrednio na dysku C (w innym przypadku dodać do pliku .env w folderze backend zmienną środowiskową FFMPEG_PATH=<sćieżka do pliku ffmpeg.exe>).
- MySQL Workbench lub inne narzędzie do zarządzania systemem bazy danych MySQL.
- Visual Studio Code lub inny redaktor kodu.

Instrukcja uruchomienia aplikacji:
1. W XAMPP uruchomić serwer MySQL na porcie 3306.
2. W MySQL Workbench skonfigurować połączenie z serwerem MySQL z poprzedniego kroku.
3. Utworzyć bazę danych przy pomocy polecenia SQL "CREATE DATABASE projekt_db".
4. Wypakować pobrany archiwum do dowolnej dyrektorii.
5. Otworzyć folder 'E-zaj-cia-main' w VSCode.
6. W terminalu przejść do katalogu 'backend', wpisać i zatwierdzić polecenie 'npm install'.
7. Przeprowadzić migrację przy pomocy wpisania i zatwierzenia polecenia 'npx sequelize-cli db:migrate'.
8. Wpisać i zatwierdzić polecenie 'node .\server.js' będąc w katalogu 'backend'.
9. Powtórzyć krok 5, ale dla katalogu 'frontend'.
10. Wpisać i zatwierdzić polecenie 'npm start', będąc w katalogu 'frontend'.
11. Przejść do strony pod adresem 'http://localhost:3001/' w przeglądarce.
