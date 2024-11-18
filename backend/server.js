const express = require('express');
const fileUpload = require('express-fileupload');
const nms = require('./media_server');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./models');
const liveRoutes = require('./routes/liveRoutes');
const socketConfig = require('./config/socket');

dotenv.config();
    
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/uploads/photos', express.static(path.join(__dirname, 'uploads/photos')));
app.use('/uploads/banners', express.static(path.join(__dirname, 'uploads/banners')));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRouter = require("./routes/likeRoutes");

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/record', recordRoutes);
app.use('/comment', commentRoutes);
app.use("/like", likeRouter);
app.use('/api/live', liveRoutes);

app.get('/', (req, res) => {
  res.send('Witamy na stronie głównej serwera');
});


db.sequelize.sync()
  .then(() => console.log("Modele zsynchronizowane z bazą danych."))
  .catch(error => console.error("Błąd synchronizacji:", error));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

socketConfig(server);

nms.run();