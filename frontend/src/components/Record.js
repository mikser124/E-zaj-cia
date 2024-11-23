import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../AuthContext'; 
import axios from 'axios';
import '../styles/Record.css';
import CommentList from './CommentList';
import defaultAvatar from '../assets/images/defaultAvatar.png';


const Record = () => {
  const { user, token, loading } = useAuth(); 
  const { id } = useParams();
  const [recordData, setRecordData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); 
  const [loadingData, setLoadingData] = useState(true); 
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

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

  const fetchRecord = useCallback(async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/record/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;
      setRecordData(data);

      const user = await fetchUser(data.uzytkownik_id);  
      setUserData(user);

      const likedStatus = localStorage.getItem(`liked_${id}`) === 'true';
      setLiked(likedStatus);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingData(false);
    }
  }, [id, token, fetchUser]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/like',
        { PostId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.liked) {
        setLiked(true);
        localStorage.setItem(`liked_${id}`, 'true'); 
        setRecordData((prevData) => ({
          ...prevData,
          liczba_polubien: prevData.liczba_polubien + 1, 
        }));
      } else {
        setLiked(false);
        localStorage.setItem(`liked_${id}`, 'false'); 
        setRecordData((prevData) => ({
          ...prevData,
          liczba_polubien: prevData.liczba_polubien - 1, 
        }));
      }

    } catch (error) {
      console.error('Error liking/unliking the record:', error);
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Brak tokenu, proszę zalogować się ponownie.');
      setLoadingData(false);
      return; 
    }

    fetchRecord();
  }, [id, token, fetchRecord]);

  const handleDelete = async () => {
    try {
        await axios.delete(`http://localhost:3000/api/record/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Nagranie zostało usunięte z bazy danych.');
        navigate('/'); 
    } catch (error) {
        console.error('Błąd podczas usuwania nagrania:', error);
        setError('Nie udało się usunąć nagrania. Spróbuj ponownie później.');
    }
};


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

          <div className="record-page-author-likes-container">
            <div className="record-page-likes-container">
              <span>{recordData.liczba_polubien}</span>
              <i
                className={`fa fa-thumbs-up ${liked ? 'liked' : 'not-liked'}`}
                aria-hidden="true"
                onClick={handleLike}
              ></i>
            </div>

            <div className="record-page-author-container">
              <Link to={`/profile/${userData.id}`} className="record-page-author-info">
                <img src={avatarUrl} alt="Autor" />
                <span>{`${userData.imie} ${userData.nazwisko}`}</span>
              </Link>
            </div>
          </div>
          {user.id === recordData.uzytkownik_id && ( 
            <button onClick={handleDelete} className="delete-record-button">
              Usuń nagranie
            </button>
          )}
        </div>
      </div>

      <CommentList nagranie_id={id} />
    </div>
  );
};

export default Record;
