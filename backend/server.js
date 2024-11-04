const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads/photos', express.static(path.join(__dirname, 'uploads/photos')));
app.use('/uploads/banners', express.static(path.join(__dirname, 'uploads/banners')));

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Witamy na stronie głównej serwera');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
