import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hls from 'hls.js';
import { Link } from 'react-router-dom';

import defaultAvatar from '../assets/images/defaultAvatar.png';
import Chat from './Chat';
import { useAuth } from '../AuthContext';

const Live = ({ userId }) => {
  const [streamData, setStreamData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [endMessage, setEndMessage] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const streamResponse = await axios.get(`http://localhost:3000/api/live/user/${userId}`);
        const userResponse = await axios.get(`http://localhost:3000/user/${userId}`);

        setUserData(userResponse.data);
        const data = streamResponse.data;

        if (data.hlsUrl) {
          setStreamData(data);
        } else {
          setErrorMessage('Transmisja HLS nie jest dostępna.');
        }
      } catch (error) {
        setErrorMessage('Transmisja na razie nie jest dostępna.');
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

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setEndMessage('Transmisja została zakończona przez autora.');
        }
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsPlaying(false);
      });

      video.onpause = () => setIsPlaying(false);
      video.onplay = () => setIsPlaying(true);
      
      return () => {
        hls.destroy();
      };
    }
  }, [streamData]);

  const endStream = () => {
    alert('Musisz skończyć transmisję w OBS.');
  };

  const togglePlay = () => {
    const video = document.getElementById('video');
    
    if (isPlaying) {
      video.pause(); 
    } else {
      video.play(); 
    }

    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return <div>Ładowanie transmisji...</div>;
  }
  
  const avatarUrl = userData?.photo ? `http://localhost:3000/${userData.photo}` : defaultAvatar;

  return (
    <div className="live-page-wrapper">
      <div className="live-page-record-container">
        <div className="live-page-left-column">
          {errorMessage && <div className="live-page-error">{errorMessage}</div>}
          {streamData && (
            <>
              <div className="live-page-video-container">
                <video id="video" controls />

                {!isPlaying && (
                   <button onClick={togglePlay} className="play-button">
                    <i className="fas fa-play"></i>
                  </button>
                )}
              </div>
              <h2 className="live-page-record-title">{streamData.tytul}</h2>
              {endMessage && (<h2 className='live-page-record-title'> Autor skończył transmisję</h2>)}
              <div className="live-page-record-details">
                <span><strong>Data:</strong> {new Date(streamData.data_rozpoczecia).toLocaleDateString()}</span>
                <span><strong>Liczba uczestników:</strong> {participantCount}</span>
                <span className="live-page-author-container">
                  <Link to={`/profile/${userData.id}`} className="live-page-author-info">
                    <img src={avatarUrl || defaultAvatar} alt="Autor" />
                    <span>{`${userData.imie} ${userData.nazwisko}`}</span>
                  </Link>
                </span>
                { user && user.id === parseInt(userId) && (
                  <span><button className="end-stream-button" onClick={endStream}>Zakończ transmisję</button></span>
                )}
              </div>
            </>
          )}
        </div>
        <div className="live-page-chat-column">
          <Chat userName={user ? `${user.imie} ${user.nazwisko} ` : 'Gość'} setParticipantCount={setParticipantCount} prowadzacyId={parseInt(userId)}/>
        </div>
      </div>
    </div>
  );
};

export default Live;
