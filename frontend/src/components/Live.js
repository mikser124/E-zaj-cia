import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hls from 'hls.js';
import { Link } from 'react-router-dom';
import defaultAvatar from '../assets/images/defaultAvatar.png';

const Live = ({ userId }) => {
  const [streamData, setStreamData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userData, setUserData] = useState(null); // Added user data for author info

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        // Fetch stream data and user data
        const streamResponse = await axios.get(`http://localhost:3000/api/live/user/${userId}`);
        const userResponse = await axios.get(`http://localhost:3000/user/${userId}`);
        
        setUserData(userResponse.data); // Save user data for author info
        const data = streamResponse.data;

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
  }, [userId]);

  useEffect(() => {
    if (streamData) {
      const video = document.getElementById('video');
      const hls = new Hls();

      hls.loadSource(streamData.hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.log("MANIFEST_PARSED");
        if (isPlaying) {
          video.play();
        }
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error('HLS error:', event, data);
        setErrorMessage('Błąd HLS: ' + data.error);
      });

      return () => {
        hls.destroy();
      };
    }
  }, [streamData, isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (isLoading) {
    return <div>Ładowanie transmisji...</div>;
  }

  const avatarUrl = userData.photo 
  ? `http://localhost:3000/${userData.photo}` 
  : defaultAvatar;

  return (
    <div className="live-page-record-container">
      <div className="live-page-video-container">
        {errorMessage && <div className="live-page-error">{errorMessage}</div>}

        {streamData && (
          <>
            <video id="video" controls>
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

      {streamData && userData && (
        <div className="live-page-record-details">
          <h2 className="live-page-record-title">{streamData.tytul}</h2>
          <p><strong>Opis:</strong> {streamData.opis || 'Brak opisu'}</p>
          <p><strong>Data rozpoczęcia:</strong> {new Date(streamData.data_rozpoczecia).toLocaleDateString()}</p>

          <div className="live-page-author-likes-container">
            <div className="live-page-author-container">
              <Link to={`/profile/${userData.id}`} className="live-page-author-info">
                <img src={avatarUrl || defaultAvatar} alt="Autor" />
                <span>{`${userData.imie} ${userData.nazwisko}`}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Live;
