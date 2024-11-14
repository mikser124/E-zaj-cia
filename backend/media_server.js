const NodeMediaServer = require('node-media-server');
const dotenv = require('dotenv');
const { Live } = require('./models');
const fs = require('fs-extra');
const path = require('path');

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

nms.on('preConnect', (id, streamPath, args) => {
  const session = nms.getSession(id);
  
  const actualUrl = streamPath.tcUrl || ''; 
  session.actualUrl = actualUrl;

  console.log(`Zapisany URL w sesji: ${actualUrl}`);
});

nms.on('prePublish', async (id, streamPath, args) => {
  const session = nms.getSession(id);
  
  const expectedUrl = 'rtmp://localhost:1935/live';
  
  const actualUrl = session.actualUrl || ''; 
  if (actualUrl !== expectedUrl) {
    console.log(`Nieprawidłowy URL transmisji: ${actualUrl}, publikacja odrzucona.`);
    session.reject();
    return;
  }

  const key = streamPath.split('/').pop();
  console.log('Otrzymany klucz:', key);

  if (!key || key === 'undefined') {
    console.log('Brak klucza transmisji, publikacja odrzucona.');
    session.reject();
    return;
  }

  try {
    const liveStream = await Live.findOne({ where: { klucz: key } });

    if (!liveStream) {
      console.log(`Nieprawidłowy klucz transmisji: ${key}, publikacja odrzucona.`);
      session.reject();
      return;
    }

    console.log(`Połączenie dozwolone dla klucza: ${key}`);
  } catch (error) {
    console.error('Błąd podczas weryfikacji klucza transmisji:', error);
    session.reject();
  }
});



module.exports = nms;
