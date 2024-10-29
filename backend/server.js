const express = require('express');
const multer = require('multer');
const cors = require('cors');

const bucket = require('./firebase'); 

const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

const upload = multer({ storage: multer.memoryStorage() }); 
const db = require('./config/database');


app.use(cors());

app.use(bodyParser.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Witamy na stronie głównej serwera');
  });


/*
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Brak pliku');
  }

  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false  
  });




  blobStream.on('finish', () => {
    res.status(200).send('Plik przesłany');
  });

  blobStream.on('error', (err) => {
    console.error('Błąd przesyłania pliku:', err);
    res.status(500).send('Błąd przesyłania pliku');
  });

  blobStream.end(req.file.buffer);
});
*/
const port = 3000;

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
