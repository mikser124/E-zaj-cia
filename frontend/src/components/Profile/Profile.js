import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Profile.css';
import defaultAvatar from '../../assets/images/defaultAvatar.png';
import { useAuth } from '../../AuthContext';
import Button from './Button';
import AddRecordingModal from './AddRecordingModal';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`http://localhost:3000/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProfileData(data);
      } else {
        console.error(data.message);
      }
    };

    fetchProfile();
  }, [id, user]);

  const fetchUpdatedProfile = async () => {
    const response = await fetch(`http://localhost:3000/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    if (response.ok) setProfileData(data);
    else console.error(data.message);
  };

  const handlePhotoUpload = async (e) => {
    const formData = new FormData();
    formData.append('photo', e.target.files[0]);
    const response = await fetch(`http://localhost:3000/profile/${id}/photo`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    if (response.ok) {
      await fetchUpdatedProfile(); 
    }
  };

  const handleBannerUpload = async (e) => {
    const formData = new FormData();
    formData.append('banner', e.target.files[0]);
    const response = await fetch(`http://localhost:3000/profile/${id}/banner`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    if (response.ok) {
      await fetchUpdatedProfile(); 
    }
  };

  if (!profileData) return <div>Ładowanie...</div>;

  const { imie, nazwisko, photo, banner, opis, nagrania, typ_uzytkownika } = profileData;
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
          onChange={(e) => setProfileData((prev) => ({ ...prev, opis: e.target.value }))}
          placeholder="Napisz coś o sobie..."
        />
      </div>

      {/* Sekcja nagrań */}
      {!isStudent && (
        <div className="record-list">
          {nagrania && nagrania.length > 0 ? (
            <div className="record-grid">
              {nagrania.map((record) => (
                <div className="record-item" key={record.id}>
                  <h4>{record.tytul}</h4>
                  <video controls>
                    <source src={record.url} type="video/mp4" />
                    Wystapił błąd w wyświetleniu filmiku
                  </video>
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

export default Profile;
