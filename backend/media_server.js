const NodeMediaServer = require('node-media-server');
const dotenv = require('dotenv');
const { User, Live } = require('./models'); 

dotenv.config();

const config = {
  logType: 3,
  rtmp: {
    port: process.env.RTMP_PORT || 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: process.env.HLS_PORT || 8000,
    mediaroot: './media',
    allow_origin: '*',
  },
  trans: {
    ffmpeg: process.env.FFMPEG_PATH || "C:\\ffmpeg\\ffmpeg-7.1-full_build\\bin\\ffmpeg.exe",
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
      },
    ],
  },
};

const nms = new NodeMediaServer(config);

let validKeys = [];

async function loadValidKeys() {
  try {
    const users = await User.findAll({
      where: { klucz: { [require('sequelize').Op.ne]: null } },
      attributes: ['klucz'],
    });
    validKeys = users.map(user => user.klucz);
    console.log('Załadowano klucze użytkowników:', validKeys);
  } catch (error) {
    console.error('Błąd podczas ładowania kluczy użytkowników:', error);
  }
}

nms.on('preConnect', async (id, streamPath, args) => {
  const session = nms.getSession(id);
  const actualUrl = streamPath.tcUrl || '';
  session.actualUrl = actualUrl;

  console.log(`Zapisany URL w sesji: ${actualUrl}`);

  await loadValidKeys();
});

nms.on('prePublish', (id, streamPath, args) => {
  const session = nms.getSession(id);

  const expectedUrl = 'rtmp://localhost:1935/live';
  const actualUrl = session.actualUrl || '';
  if (actualUrl !== expectedUrl) {
    console.log(`Nieprawidłowy URL transmisji: ${actualUrl}, publikacja odrzucona.`);
    session.reject();
    return;
  }

  const key = streamPath.split('/').pop();
  session.title = global.temporaryTitles[key] || 'Domyślny tytuł';
  console.log(`[NMS] Przypisano tytuł dla sesji ${id}: ${session.title}`);

  if (!key || key === 'undefined') {
    console.log('Brak klucza transmisji, publikacja odrzucona.');
    session.reject();
    return;
  }

  if (!validKeys.includes(key)) {
    console.log(`Nieprawidłowy klucz transmisji: ${key}, publikacja odrzucona.`);
    session.reject();
    return;
  }

  console.log(`Połączenie dozwolone dla klucza: ${key}`);
});



nms.on('postPublish', async (id, streamPath, args) => {
  const session = nms.getSession(id);
  const tytul = session.title || 'Domyślny tytuł';
  console.log(`[NMS] Transmisja rozpoczęta z tytułem: ${tytul}`);

  const key = streamPath.split('/').pop();
  console.log(`[NMS] Transmisja rozpoczęta z kluczem: ${key}`);

  try {
    // Pobierz użytkownika na podstawie klucza
    const user = await User.findOne({ where: { klucz: key } });

    if (!user) {
      console.error(`[NMS] Nie znaleziono użytkownika z kluczem: ${key}`);
      return;
    }


    // Utwórz nowy wpis transmisji
    const liveEntry = await Live.create({
      uzytkownik_id: user.id,
      tytul,
      data_rozpoczecia: new Date(),
    });

    console.log(`[NMS] Transmisja została zarejestrowana w bazie: ID=${liveEntry.id}`);
    delete temporaryTitles[key]; // Usunięcie tymczasowego tytułu, jeśli istnieje
  } catch (error) {
    console.error(`[NMS] Błąd podczas rejestracji transmisji: ${error.message}`);
  }
});



nms.on('donePublish', async (id, streamPath, args) => {
  const key = streamPath.split('/').pop();
  console.log(`[NMS] Transmisja zakończona z kluczem: ${key}`);

  try {
    // Pobierz użytkownika i otwartą transmisję w jednym zapytaniu
    const user = await User.findOne({ where: { klucz: key } });
    if (!user) {
      console.error(`[NMS] Nie znaleziono użytkownika z kluczem: ${key}`);
      return;
    }

    const liveEntry = await Live.findOne({
      where: {
        uzytkownik_id: user.id,
        data_zakonczenia: null,
      },
    });

    if (!liveEntry) {
      console.warn(`[NMS] Nie znaleziono aktywnej transmisji dla użytkownika: ID=${user.id}`);
      return;
    }

    if (global.temporaryTitles[key]) {
      delete global.temporaryTitles[key];
      console.log(`[NMS] Usunięto tytuł z pamięci dla klucza: ${key}`);
    }
    
    // Zaktualizuj datę zakończenia transmisji
    liveEntry.data_zakonczenia = new Date();
    await liveEntry.save();

    console.log(`[NMS] Zakończono transmisję: ID=${liveEntry.id}`);
  } catch (error) {
    console.error(`[NMS] Błąd podczas aktualizacji zakończenia transmisji: ${error.message}`);
  }
});


module.exports = nms;
