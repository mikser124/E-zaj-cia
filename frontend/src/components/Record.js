import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { useAuth } from '../AuthContext'; 
import '../styles/Record.css';
import CommentList from './CommentList';
import defaultAvatar from '../assets/images/defaultAvatar.png';

const Record = () => {
  const { token, loading } = useAuth(); 
  const { id } = useParams();
  const [recordData, setRecordData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); 
  const [loadingData, setLoadingData] = useState(true); 

  const fetchUser = useCallback(async (userId) => {
    console.log(`Fetching user with ID: ${userId}`);
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Błąd pobierania użytkownika: ${response.statusText}`);
      }
  
      const userData = await response.json();
      console.log('User data fetched:', userData);
      return userData;
    } catch (error) {
      setError(error.message);
      console.error('Fetch user error:', error);
      return null;
    }
  }, [token]);
  

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

        const user = await fetchUser(data.uzytkownik_id);  
        setUserData(user);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingData(false); 
      }
    };

    if (token) {
      fetchRecord();
    }
  }, [id, token, fetchUser]);  

  if (loading || loadingData) return <div>Ładowanie...</div>;

  if (error) return <div>Błąd: {error}</div>; 

  if (!recordData || !userData) {
    return <div>Brak danych do wyświetlenia.</div>;
  }

  const avatarUrl = userData.photo 
    ? `http://localhost:3000/${userData.photo}` 
    : defaultAvatar;

  return (
    <div className="record-page-wrapper">
      <div className="record-page-record-container">
        <div className="record-page-video-container">
          <video controls>
            <source src={recordData.url} type="video/mp4" />
            Twoja przeglądarka nie wspiera tagu wideo.
          </video>
        </div>

        <div className="record-page-record-details">
          <h2 className="record-page-record-title">{recordData.tytul}</h2>
          <p><strong>Opis:</strong> {recordData.opis || 'Brak opisu'}</p>
          <p><strong>Data nagrania:</strong> {new Date(recordData.data_nagrania).toLocaleDateString()}</p>

          <div className="record-page-likes-container">
            <span>{recordData.likes} Polubienia</span>
            <button className="like-button">Lubię to</button>
          </div>

          <div className="record-page-author-container">

              <Link to={`/profile/${userData.id}`} className="record-page-author-info">
                <img src={avatarUrl} alt="Autor" />
                <span>{`${userData.imie} ${userData.nazwisko}`}</span>
              </Link>
          
          </div>
        </div>
      </div>

      <CommentList nagranie_id={id} />
    </div>
  );
};
export default Record;
