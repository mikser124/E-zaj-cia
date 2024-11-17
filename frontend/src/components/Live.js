import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hls from 'hls.js';

const Live = ({ liveId }) => {
  const [streamData, setStreamData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false); // Stan dla kontrolowania odtwarzania

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/live/${liveId}`);
        const data = response.data;
        if (data.hlsUrl) {
          setStreamData(data);  
        } else {
          setErrorMessage('Transmisja HLS nie jest dostępna.');
        }
      } catch (error) {
        setErrorMessage('Nie udało się pobrać transmisji.');
        console.error('Error fetching stream data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamData();
  }, [liveId]); 

  useEffect(() => {
    if (streamData && Hls.isSupported()) {
      const video = document.getElementById('video'); 
      const hls = new Hls();

      hls.loadSource(streamData.hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.log("MANIFEST_PARSED");
        if (isPlaying) {
          video.play(); // Rozpocznij odtwarzanie po kliknięciu
        }
      });

      hls.on(Hls.Events.ERROR, function(event, data) {
        console.error('HLS error:', event, data);
        setErrorMessage('Błąd HLS: ' + data.error);
      });

      return () => {
        hls.destroy(); 
      };
    } else {
      setErrorMessage('Twoja przeglądarka nie obsługuje HLS.');
    }
  }, [streamData, isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true); // Zaktualizuj stan na true, aby rozpocząć odtwarzanie
  };

  if (isLoading) {
    return <div>Ładowanie transmisji...</div>;
  }

  return (
    <div className="live-page-wrapper">
      {errorMessage && <div className="live-page-error">{errorMessage}</div>}
      <div className="live-page-container">
        {/* Kolumna 1: Transmisja na żywo */}
        <div className="live-page-video-container">
          {streamData && (
            <>
              <video id="video" controls className="live-video">
                Twoja przeglądarka nie obsługuje tagu video.
              </video>
              {!isPlaying && (
                <button onClick={handlePlay} className="play-button">
                  Odtwórz transmisję
                </button>
              )}
            </>
          )}
        </div>

        {/* Kolumna 2: Detale transmisji */}
        <div className="live-page-details-container">
          {streamData && (
            <div className="live-page-details">
              <h2 className="live-page-title">{streamData.tytul}</h2>
              <p><strong>Opis:</strong> {streamData.opis || 'Brak opisu'}</p>
              <p><strong>Data rozpoczęcia:</strong> {new Date(streamData.data_rozpoczecia).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Live;
