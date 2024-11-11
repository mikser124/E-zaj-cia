import React, { useEffect, useState } from 'react';
import '../styles/CommentList.css'; // Załaduj plik CSS, aby dodać style

const CommentList = ({ nagranie_id }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  // Funkcja do pobierania komentarzy
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/comment/${nagranie_id}`);
        const data = await response.json();

        setComments(data.comments);
        setLoading(false);
      } catch (error) {
        console.error('Błąd podczas pobierania komentarzy:', error);
        setError('Błąd pobierania komentarzy');
        setLoading(false);
      }
    };

    fetchComments();
  }, [nagranie_id]);

  // Funkcja do dodawania komentarza
  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const response = await fetch(`http://localhost:3000/comment/${nagranie_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`  // Przykład, zakładając że token jest w localStorage
        },
        body: JSON.stringify({
          text: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error('Błąd dodawania komentarza');
      }

      const data = await response.json();
      setComments([data.newComment, ...comments]); // Dodaj nowy komentarz do listy
      setNewComment(''); // Wyczyść pole formularza
    } catch (error) {
      console.error('Błąd podczas dodawania komentarza:', error);
      setError('Błąd podczas dodawania komentarza');
    }
  };

  if (loading) {
    return <div className="comment-list-loading">Ładowanie komentarzy...</div>;
  }

  if (error) {
    return <div className="comment-list-error">{error}</div>;
  }

  return (
    <div className="comment-list">
      <div className="comment-list-input-container">
        <textarea
          className="comment-list-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Dodaj komentarz..."
        />
        <button className="comment-list-add-btn" onClick={handleAddComment}>Dodaj komentarz</button>
      </div>

      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <p className="comment-text">{comment.text}</p>
          </div>
        ))
      ) : (
        <div className="comment-list-empty">Brak komentarzy do wyświetlenia</div>
      )}
    </div>
  );
};

export default CommentList;
