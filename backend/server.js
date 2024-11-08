const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Używamy userRoutes zamiast profileRoutes
const recordRoutes = require('./routes/recordRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ścieżki do plików zdjęć i banerów
app.use('/uploads/photos', express.static(path.join(__dirname, 'uploads/photos')));
app.use('/uploads/banners', express.static(path.join(__dirname, 'uploads/banners')));

// Trasy API
app.use('/auth', authRoutes);
app.use('/user', userRoutes); // Zmieniamy ścieżkę na /user
app.use('/uploads', express.static('uploads'));
app.use('/api/record', recordRoutes); // Trasa do nagrań

// Strona główna
app.get('/', (req, res) => {
  res.send('Witamy na stronie głównej serwera');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
