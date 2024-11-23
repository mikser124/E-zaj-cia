const express = require('express');
const fileUpload = require('express-fileupload');
const { nms } = require('./media_server');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./models');


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
const likeRoutes = require("./routes/likeRoutes");
const liveRoutes = require('./routes/liveRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const pointRoutes = require('./routes/pointRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/record', recordRoutes);
app.use('/comment', commentRoutes);
app.use("/like", likeRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/points', pointRoutes);
app.use('/messages', messageRoutes);

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