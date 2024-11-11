import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Profile.css';
import defaultAvatar from '../../assets/images/defaultAvatar.png';
import { useAuth } from '../../AuthContext';
import Button from './Button';
import AddRecordingModal from './AddRecordingModal';

const UserProfile = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      const response = await fetch(`http://localhost:3000/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUserData(data);
      } else {
        console.error(data.message);
      }
    };

    fetchUser();
  }, [id, token]);

  const fetchUpdatedUser = async () => {
    if (!token) return;

    const response = await fetch(`http://localhost:3000/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) setUserData(data);
    else console.error(data.message);
  };

  const handlePhotoUpload = async (e) => {
    if (!token) return;
  
    const formData = new FormData();
    formData.append('photo', e.target.files[0]);
  
    const response = await fetch(`http://localhost:3000/user/${id}/update-photo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, 
      body: formData,
    });
  
    if (response.ok) {
      await fetchUpdatedUser();  
    } else {
      const data = await response.json();
      console.error('Błąd podczas aktualizacji zdjęcia profilowego:', data.message);
    }
  };
  
  const handleBannerUpload = async (e) => {
    if (!token) return;
  
    const formData = new FormData();
    formData.append('banner', e.target.files[0]);
  
  
    const response = await fetch(`http://localhost:3000/user/${id}/update-banner`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },  
      body: formData,
    });
  
    if (response.ok) {
      await fetchUpdatedUser();
    } else {
      console.error('Błąd podczas wysyłania banera:', await response.text());
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
          {isOwnProfile && (
            <Button
              label="Dodaj nagranie"
              onClick={() => setIsModalOpen(true)} 
              variant="addVideo"
            />
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
