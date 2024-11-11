import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { useAuth } from '../AuthContext'; 
import '../styles/Record.css';
import CommentList from './CommentList';

const Record = () => {
  const { token, loading } = useAuth(); 
  const { id } = useParams();
  const [recordData, setRecordData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); 
  const [loadingData, setLoadingData] = useState(true); 

  useEffect(() => {
    if (!token) {
      setError('Brak tokenu, proszę zalogować się ponownie.');
      setLoadingData(false);
      return; 
    }

    const fetchRecord = async () => {
      setLoadingData(true);
      try {
        const response = await fetch(`http://localhost:3000/api/record/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`Błąd pobierania nagrania: ${response.statusText}`);
        }

        const data = await response.json();
        setRecordData(data);

        const userResponse = await fetch(`http://localhost:3000/user/${data.uzytkownik_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error(`Błąd pobierania użytkownika: ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();
        setUserData(userData);


      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingData(false); 
      }
    };

    if (token) {
      fetchRecord();
    }
  }, [id, token]);

  if (loading || loadingData) return <div>Ładowanie...</div>;

  if (error) return <div>Błąd: {error}</div>; 

  if (!recordData || !userData) {
    return <div>Brak danych do wyświetlenia.</div>;
  }

  return (
    <div className="record-page-wrapper">
      <div className="record-page-record-container">
        {/* Video on the left side */}
        <div className="record-page-video-container">
          <video controls>
            <source src={recordData.url} type="video/mp4" />
            Twoja przeglądarka nie wspiera tagu wideo.
          </video>
        </div>

        {/* Recording details on the right side */}
        <div className="record-page-record-details">
          <h2 className="record-page-record-title">{recordData.tytul}</h2>
          <p><strong>Opis:</strong> {recordData.opis || 'Brak opisu'}</p>
          <p><strong>Data nagrania:</strong> {new Date(recordData.data_nagrania).toLocaleDateString()}</p>

          {/* Likes count and "Like" button */}
          <div className="record-page-likes-container">
            <span>{recordData.likes} Polubienia</span>
            <button className="like-button">Lubię to</button>
          </div>

          {/* Recording author */}
          <div className="record-page-author-container">
            <div className="record-page-author-info">
              <img src={userData ? userData.avatarUrl : '/path/to/default-avatar.jpg'} alt="Autor" />
              <span>{userData ? `${userData.imie} ${userData.nazwisko}` : 'Nieznany autor'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Komponent z komentarzami poniżej nagrania */}
      <CommentList nagranie_id={id} />
    </div>
  );

};

export default Record;
