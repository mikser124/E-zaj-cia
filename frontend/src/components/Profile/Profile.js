import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Profile.css';
import defaultAvatar from '../../assets/images/defaultAvatar.png';
import { useAuth } from '../../AuthContext';
import Button from './Button';
import axios from 'axios';

const UserProfile = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditingOpis, setIsEditingOpis] = useState(false); 
  const [editedOpis, setEditedOpis] = useState(''); 

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setEditedOpis(response.data.opis || '');
      } catch (error) {
        console.error(error.response?.data?.message || 'Błąd pobierania użytkownika');
      }
    };

    fetchUser();
  }, [id, token]);

  const fetchUpdatedUser = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`http://localhost:3000/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || 'Błąd pobierania zaktualizowanego użytkownika');
    }
  };

  const handlePhotoUpload = async (e) => {
    if (!token) return;

    const formData = new FormData();
    formData.append('photo', e.target.files[0]);

    try {
      await axios.post(`http://localhost:3000/user/${id}/update-photo`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUpdatedUser();
    } catch (error) {
      console.error('Błąd podczas aktualizacji zdjęcia profilowego:', error.response?.data?.message);
    }
  };

  const handleBannerUpload = async (e) => {
    if (!token) return;

    const formData = new FormData();
    formData.append('banner', e.target.files[0]);

    try {
      await axios.post(`http://localhost:3000/user/${id}/update-banner`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUpdatedUser();
    } catch (error) {
      console.error('Błąd podczas wysyłania banera:', error.response?.data?.message);
    }
  };

  const handleOpisUpdate = async () => {
    if (!token) return;

    try {
      const updatedOpis = editedOpis.trim() === '' ? null : editedOpis;

      await axios.put(
        `http://localhost:3000/user/${id}/update-description`,
        { opis: updatedOpis },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditingOpis(false);
      setUserData((prev) => ({ ...prev, opis: updatedOpis }));
    } catch (error) {
      console.error('Błąd podczas aktualizacji opisu:', error.response?.data?.message);
    }
  };


  const handleOpisClear = async () => {
    setEditedOpis('');
  }

  if (!userData) return <div>Ładowanie...</div>;

  const { imie, nazwisko, photo, banner, opis, nagrania, typ_uzytkownika, rola, liczba_polubien, liczba_punktow } = userData;
  const bannerUrl = banner ? `http://localhost:3000/${banner}` : '';
  const avatarUrl = photo ? `http://localhost:3000/${photo}` : defaultAvatar;

  const isOwnProfile = user && user.id === parseInt(id);
  const isStudent = typ_uzytkownika === 'student';
  console.log("ROLA", rola.toLowerCase());
  return (
    <div className="profile-container">
      <div className="profile-banner" style={{ backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover' }}>
        <div className="profile-info">
          <div className="avatar-container">
            <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
            {isOwnProfile && (
              <div className="camera-icon">
                <FontAwesomeIcon
                  icon={faCamera}
                  size="2x"
                  onClick={() => document.querySelector('#photo-upload').click()}
                />
              </div>
            )}
            <input
              type="file"
              id="photo-upload"
              onChange={handlePhotoUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <h2 className="profile-name">
            {`${imie} ${nazwisko}`}
          </h2>
          <div className={`profile-page-user-type ${typ_uzytkownika.toLowerCase()}`}> {typ_uzytkownika.toLowerCase()} </div>
          <div className={`profile-page-user-role ${rola.toLowerCase()}`}> {rola.toLowerCase()} </div>
          
          <div className="profile-stats">
            <p><strong>Punkty:</strong> {liczba_punktow || 0}</p>
            <p><strong>Polubienia:</strong> {liczba_polubien || 0}</p>
          </div>
          {isOwnProfile && (
            <Button
              label="Zmień zdjęcie baneru"
              onClick={() => document.querySelector('#banner-upload').click()}
              variant="upload"
            />
          )}
          <input type="file" id="banner-upload" onChange={handleBannerUpload} accept="image/*" style={{ display: 'none' }} />
        </div>

      </div>

      <div className="profile-comment">
  <img src={avatarUrl} alt="Avatar" className="small-avatar" />
  {isOwnProfile && isEditingOpis ? (
    <div>
      <textarea
        className="comment-textarea"
        value={editedOpis}
        onChange={(e) => setEditedOpis(e.target.value)}
        placeholder="Napisz coś o sobie..."
      />
      <div className='button-group'>
        <Button label="Zapisz" onClick={handleOpisUpdate} variant="save" />
        <Button label="Anuluj" onClick={() => setIsEditingOpis(false)} variant="cancel" />
        <Button label="Wyczysc" onClick={handleOpisClear} variant='clear'/>
      </div>
    </div>
  ) : (
    <span 
      className='user-description' 
      onClick={() => isOwnProfile && setIsEditingOpis(true)}
    >
      {opis ? opis : (isOwnProfile ? 'Kliknij, aby dodać opis...' : 'Ten użytkownik jeszcze nie napisał nic o sobie...')}
    </span>
  )}
</div>


      {!isStudent && (
        <div className="record-list">
          {isOwnProfile && (
            <div>
            <Link to={`/add-recording/${id}`}>
              <Button label="Dodaj nagranie" variant="addVideo" />
            </Link>
              <Link to="/start-live">
                <Button label="Rozpocznij transmisję na żywo" variant="live" />
              </Link>
            </div>
          )}
          {nagrania && nagrania.length > 0 ? (
            <div className="record-grid">
              {nagrania.map((record) => (
                <div className="record-item" key={record.id}>
                  <Link to={`/record/${record.id}`} key={record.id} className="record-item">
                    <h4>{record.tytul}</h4>
                    <video controls>
                      <source src={record.url} type="video/mp4" />
                    </video>
                  </Link>
                </div>
              ))}
            </div>
          ) : null}


        </div>
      )}
    </div>
  );
};

export default UserProfile;
