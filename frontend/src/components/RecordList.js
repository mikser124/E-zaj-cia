import React, { useEffect, useState } from 'react';
import '../styles/RecordList.css';
import liveImage from '../assets/images/live.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const RecordList = () => {
  const [records, setRecords] = useState([]);
  const [activeLives, setActiveLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const recordsResponse = await fetch('/api/record/record-list');
        if (!recordsResponse.ok) {
          throw new Error('Nie udało się pobrać nagrań');
        }
        const recordsData = await recordsResponse.json();

        const livesResponse = await fetch('/api/live/active');
        if (!livesResponse.ok) {
          throw new Error('Nie udało się pobrać aktywnych transmisji');
        }
        const livesData = await livesResponse.json();

        setRecords(recordsData);
        setActiveLives(livesData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Nie udało się pobrać kategorii');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);
  
  const filterItems = (items, query, category) => {
    console.log("Filtrujemy:", { query, category }); 
  
    return items.filter((item) => {
      const matchesQuery = item.tytul.toLowerCase().includes(query.toLowerCase());
      console.log("Dopasowanie do tytułu:", item.tytul, matchesQuery); 
  

      const itemCategoryId = item.kategoria_id ? Number(item.kategoria_id) : null;
      const selectedCategory = category ? Number(category) : null;
  
      const matchesCategory = selectedCategory
        ? itemCategoryId === selectedCategory
        : true;
  
      console.log("Dopasowanie do kategorii:", itemCategoryId, selectedCategory, matchesCategory); 
  
      return matchesQuery && matchesCategory;
    });
  };
  

  const filteredRecords = filterItems(records, searchQuery, selectedCategory);
  const filteredLives = filterItems(activeLives, searchQuery, selectedCategory);

  const handleRecordClick = (id) => {
    if (isAuthenticated) {
      navigate(`/record/${id}`);
    } else {
      navigate('/login');
    }
  };

  const handleLiveClick = (userId) => {
    navigate(`/live/${userId}`);
  };

  const handleUserProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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

      <div className="category-filter">
        <label htmlFor="category-select">Wybierz kategorię:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setSelectedCategory(selectedValue); 
            console.log("Wybrana kategoria:", selectedValue); 
          }}
        >
          <option value="">Wszystkie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nazwa}
            </option>
          ))}
        </select>
      </div>

      <ul className="home-page-record-list">
        {filteredLives.length > 0 ? (
          filteredLives.map((live) => (
            <li
              className="home-page-record-item"
              key={live.id}
              onClick={() => handleLiveClick(live.uzytkownik_id)}
            >
              <div className="home-page-video-container">
                <img
                  src={liveImage}
                  alt="Transmisja na żywo"
                  className="home-page-live-image"
                />
              </div>
              <div className="home-page-video-title">
                <h3>{live.tytul}</h3>
              </div>
              <div
                className="user-info"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserProfileClick(live.uzytkownik_id);
                }}
              >
                <img
                  src={live.User.photo}
                  alt="User"
                  className="user-photo"
                />
                <p>{`${live.User.imie} ${live.User.nazwisko}`}</p>
              </div>
            </li>
          ))
        ) : (
          <li></li>
        )}
      </ul>

      <ul className="home-page-record-list">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <li
              className="home-page-record-item"
              key={record.id}
              onClick={() => handleRecordClick(record.id)}
            >
              <div className="home-page-video-container">
                <video className="home-page-record-video">
                  <source src={record.url} type="video/mp4" />
                </video>
              </div>
              <div className="home-page-video-title">
                <h3>{record.tytul}</h3>
              </div>
              <div
                className="user-info"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserProfileClick(record.uzytkownik_id);
                }}
              >
                <img
                  src={record.User.photo}
                  alt="User"
                  className="user-photo"
                />
                <p>{`${record.User.imie} ${record.User.nazwisko}`}</p>
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
