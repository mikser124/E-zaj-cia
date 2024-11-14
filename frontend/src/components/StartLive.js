import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 

const StartLive = () => {
  const { token } = useAuth();  
  const [liveKey, setLiveKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [hlsUrl, setHlsUrl] = useState('');
  const [isLiveReady, setIsLiveReady] = useState(false);

  const handleStartLive = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/live', 
        {
          tytul: 'Testowa transmisja',
          data_rozpoczecia: new Date(),
          data_zakonczenia: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        }
      );

      const { klucz, rtmpUrl, hlsUrl } = response.data;

      setLiveKey(klucz);
      setRtmpUrl(rtmpUrl);
      setHlsUrl(hlsUrl);
      setIsLiveReady(true);
      setErrorMessage('');
    } catch (error) {
      console.error("Błąd podczas tworzenia transmisji:", error);
      setErrorMessage('Nie udało się rozpocząć transmisji. Spróbuj ponownie.');
    }
  };

  return (
    <div>
      <h2>Rozpocznij transmisję</h2>
      <button onClick={handleStartLive}>Rozpocznij transmisję</button>

      {isLiveReady && (
        <div>
          <h3>Link RTMP do OBS:</h3>
          <p>{rtmpUrl}</p>
          <p>Skopiuj ten link i wklej go do OBS w polu "Klucz transmisji".</p>

          <h3>Link HLS:</h3>
          <p>{hlsUrl}</p>
          <p>Możesz również skorzystać z tego linku do podglądu transmisji.</p>

          <h3>Twój unikalny klucz:</h3>
          <p>{liveKey}</p>
          <p>Wprowadź ten klucz w OBS, aby rozpocząć transmisję.</p>
        </div>
      )}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default StartLive;
