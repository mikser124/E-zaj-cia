import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import '../styles/StartLive.css';
import { Link } from 'react-router-dom';

const StartLive = () => {
  const { token, user } = useAuth();
  const [streamTitle, setStreamTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [userKey, setUserKey] = useState('');
  const [isLiveReady, setIsLiveReady] = useState(false);

  const handleSetTitle = async () => {
    try {
      const checkResponse = await axios.get('http://localhost:3000/api/live/check-active', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (checkResponse.data.active) {
        setErrorMessage('Masz już aktywną transmisję. Proszę zakończyć poprzednią, zanim rozpoczniesz nową.');
        return;
      }

      if (!streamTitle.trim()) {
        setErrorMessage('Proszę wprowadzić nazwę transmisji.');
        return;
      }

      const response = await axios.post(
        'http://localhost:3000/api/live/title',
        { tytul: streamTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { key } = response.data;
      setUserKey(key);
      setRtmpUrl(`rtmp://localhost:1935/live`);
      setIsLiveReady(true);
      setErrorMessage('');

      console.log("Tytuł transmisji został zapisany, odpowiedź:", response.data);

    } catch (error) {
      if (error.response) {
        if (error.response.data.error && error.response.data.error.includes('Masz już aktywną transmisję')) {
          setErrorMessage(error.response.data.error); 
        } else {
          setErrorMessage('Nie udało się zapisać tytułu transmisji.');
        }
      } else if (error.request) {
        setErrorMessage('Brak odpowiedzi od serwera. Spróbuj ponownie później.');
      } else {
        setErrorMessage('Nie udało się zapisać tytułu transmisji.');
      }
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
                className="start-live-input"
              />
            </label>
          </div>

          <button type="button" onClick={handleSetTitle} className="start-live-button">
            Rozpocznij transmisję
          </button>

          {errorMessage && <p className="start-live-error">{errorMessage}</p>}
        </form>
      )}

      {isLiveReady && (
        <div className="start-live-info">
          <h3>Konfiguracja OBS:</h3>
          <p><strong>URL RTMP:</strong> {rtmpUrl}</p>
          <p><strong>Klucz transmisji:</strong> {userKey}</p>

          <h3>Link do oglądania:</h3>
          <p>
            <Link to={`/live/${user.id}`}>
              Oglądaj transmisję
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default StartLive;
