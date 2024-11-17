import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import '../styles/StartLive.css';

const StartLive = () => {
  const { token } = useAuth();  
  const [userKey, setUserKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [hlsUrl, setHlsUrl] = useState('');
  const [isLiveReady, setIsLiveReady] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [liveId, setLiveId] = useState(''); 

  const handleStartLive = async () => {
    if (!streamTitle.trim()) {
      setErrorMessage('Proszę wprowadzić nazwę transmisji.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/live', 
        {
          tytul: streamTitle, 
          data_rozpoczecia: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        }
      );

      const { userKey, rtmpUrl, live: { id } } = response.data;
      setUserKey(userKey); 
      setRtmpUrl(rtmpUrl);
      setHlsUrl(hlsUrl);
      setLiveId(id); 
      setIsLiveReady(true);
      setErrorMessage('');
    } catch (error) {
      console.error("Błąd podczas tworzenia transmisji:", error);
      setErrorMessage('Nie udało się rozpocząć transmisji. Spróbuj ponownie.');
    }
  };

  return (
    <div className="start-live-form-container">
      <h2 className="start-live-form-title">Stworzenie transmisji</h2>
      
      {!isLiveReady && (
        <form className="start-live-form">
          <div className="start-live-form-field">
            <label htmlFor="start-live-tytul">
              <strong>Nazwa transmisji</strong>
              <input
                type="text"
                id="start-live-tytul"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="Wprowadź nazwę transmisji"
                name="tytul"
                className="start-live-input"
              />
            </label>
          </div>

          <button type="button" onClick={handleStartLive} className="start-live-button">
            Rozpocznij transmisję
          </button>

          {errorMessage && <p className="start-live-error" style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      )}

      {isLiveReady && (
        <div className="start-live-info">
          <h3>Aby uruchomić transmisję w OBS Studio, wykonaj poniższe kroki:</h3>
          <p><strong>1. Wprowadź URL RTMP:</strong> {rtmpUrl}</p>
          <p><strong>2. Wprowadź klucz transmisji:</strong> {userKey}</p>
          <p>Po skonfigurowaniu OBS, rozpocznij transmisję w programie.</p>

          <h3>Aby oglądać transmisję na żywo, przejdź do tego linku:</h3>
          <p>
            <a href={`/live/${liveId}`} target="_blank" rel="noopener noreferrer">
              Oglądaj transmisję
            </a>
          </p>
          <p>Użyj tego linku, aby obejrzeć transmisję na żywo w przeglądarce.</p>
        </div>
      )}
    </div>
  );
};

export default StartLive;
