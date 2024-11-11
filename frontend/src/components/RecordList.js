import React, { useEffect, useState } from 'react';
import '../styles/RecordList.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const RecordList = () => {
  const [records, setRecords] = useState([]);  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);    
  const [searchQuery, setSearchQuery] = useState(''); 

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/record/record-list'); 

        if (!response.ok) {
          throw new Error('Nie udało się pobrać nagrań');  
        }

        const data = await response.json();  
        setRecords(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false);  
      }
    };

    fetchRecords();
  }, []);  

  const filteredRecords = records.filter(record => 
    record.tytul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Ładowanie...</div>;  
  }

  if (error) {
    return <div>{error}</div>; 
  }

  const handleRecordClick = (id) => {
    if (isAuthenticated) {
      navigate(`/record/${id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page-record-list-container">
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Wyszukaj po tytule..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}  
          className="search-input"
        />
      </div>

      <ul className="home-page-record-list">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <li className="home-page-record-item" key={record.id} onClick={() => handleRecordClick(record.id)}>
              <div className="home-page-video-container">
                <video className="home-page-record-video">
                  <source src={record.url} type="video/mp4" />
                  Twoja przeglądarka nie obsługuje wideo HTML5.
                </video>
              </div>
              <div className="home-page-video-title">
                <h3>{record.tytul}</h3>
              </div>
            </li>
          ))
        ) : (
          <li><h3>Brak wyników dla wybranego zapytania.</h3></li>
        )}
      </ul>
    </div>
  );
};

export default RecordList;
