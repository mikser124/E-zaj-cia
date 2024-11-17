import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Profile.css';
import defaultAvatar from '../../assets/images/defaultAvatar.png';
import { useAuth } from '../../AuthContext';
import Button from './Button';
import AddRecordingModal from './AddRecordingModal';
import axios from 'axios'; 

const UserProfile = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
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
  if (!userData) return <div>Ładowanie...</div>;

  const { imie, nazwisko, photo, banner, opis, nagrania, typ_uzytkownika } = userData;
  const bannerUrl = banner ? `http://localhost:3000/${banner}` : '';
  const avatarUrl = photo ? `http://localhost:3000/${photo}` : defaultAvatar;

  const isOwnProfile = user && user.id === parseInt(id);
  const isStudent = typ_uzytkownika === 'student';

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
          <h2 className="profile-name">{`${imie} ${nazwisko}`}</h2>
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
        <textarea
          className="comment-textarea"
          value={opis || ""}
          onChange={(e) => setUserData((prev) => ({ ...prev, opis: e.target.value }))}
          placeholder="Napisz coś o sobie..."
        />
      </div>

      {!isStudent && (
        
        <div className="record-list">
          {isOwnProfile && (
            <div>
                <Button
                  label="Dodaj nagranie"
                  onClick={() => setIsModalOpen(true)} 
                  variant="addVideo"
                />

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
          ) : (
            null
          )}

          <AddRecordingModal 
            isOpen={isModalOpen} 
            onRequestClose={() => setIsModalOpen(false)} 
            userId={id} 
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
