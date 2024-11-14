import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { useAuth } from '../AuthContext'; 
import axios from 'axios';
import '../styles/Record.css'; 
import defaultAvatar from '../assets/images/defaultAvatar.png';
import Hls from 'hls.js';

const LiveStream = () => {
  const { token, loading } = useAuth(); 
  const { id } = useParams();
  const [streamData, setStreamData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); 
  const [loadingData, setLoadingData] = useState(true); 

  const fetchUser = useCallback(async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      setError(error.message);
      return null;
    }
  }, [token]);

  const fetchStream = useCallback(async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/live/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;
      setStreamData(data);

      const user = await fetchUser(data.uzytkownik_id);  
      setUserData(user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingData(false);
    }
  }, [id, token, fetchUser]);

  useEffect(() => {
    if (!token) {
      setError('Brak tokenu, proszę zalogować się ponownie.');
      setLoadingData(false);
      return; 
    }

    fetchStream();
  }, [id, token, fetchStream]);

  const videoRef = React.useRef(null);

  useEffect(() => {
    if (videoRef.current && streamData && Hls.isSupported()) {
      const video = videoRef.current;
      const hls = new Hls();
      hls.loadSource(`http://localhost:8000/live/${id}/index.m3u8`); 
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    }
  }, [streamData, id]);

  if (loading || loadingData) return <div>Ładowanie...</div>;

  if (error) return <div>Błąd: {error}</div>;

  if (!streamData || !userData) {
    return <div>Brak danych do wyświetlenia.</div>;
  }

  const avatarUrl = userData.photo 
    ? `http://localhost:3000/${userData.photo}` 
    : defaultAvatar;

  return (
    <div className="record-page-wrapper">
      <div className="record-page-record-container">
        <div className="record-page-video-container">
          <video
            ref={videoRef}
            controls
            width="100%"
            style={{ maxWidth: '800px' }}
          >
            Twoja przeglądarka nie wspiera tagu wideo.
          </video>
        </div>

        <div className="record-page-record-details">
          <h2 className="record-page-record-title">{streamData.nazwa}</h2>

          <div className="record-page-author-likes-container">
            <div className="record-page-author-container">
              <Link to={`/profile/${userData.id}`} className="record-page-author-info">
                <img src={avatarUrl} alt="Autor" />
                <span>{`${userData.imie} ${userData.nazwisko}`}</span>
              </Link>
            </div>
          </div>

          <div className="record-page-time-container">
            <p><strong>Data rozpoczęcia:</strong> {new Date(streamData.data_rozpoczecia).toLocaleString()}</p>
            <p><strong>Data zakończenia:</strong> {new Date(streamData.data_zakonczenia).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
