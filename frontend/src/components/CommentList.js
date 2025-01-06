import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import '../styles/CommentList.css';
import defaultAvatar from '../assets/images/defaultAvatar.png';
import '../styles/Button.css';

const CommentList = ({ nagranie_id }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [originalCommentText, setOriginalCommentText] = useState(''); 
  const [users, setUsers] = useState({});

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/comment/${nagranie_id}`);
      const data = await response.json();

      if (Array.isArray(data.comments)) {
        setComments(data.comments);
      } else {
        setComments([]);
      }
      setLoading(false);
    } catch (error) {
      setError('Błąd pobierania komentarzy');
      setLoading(false);
    }
  }, [nagranie_id]);

  useEffect(() => {
    fetchComments();
  }, [nagranie_id, fetchComments]);

  const fetchUser = async (userId) => {
    const response = await fetch(`http://localhost:3000/user/${userId}`);
    const userData = await response.json();
    return userData;
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      const usersData = {};
      for (const comment of comments) {
        const userData = await fetchUser(comment.uzytkownik_id);
        usersData[comment.uzytkownik_id] = userData;
      }
      setUsers(usersData);
    };

    if (comments.length > 0) {
      fetchUsersData();
    }
  }, [comments]);

  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      setError('Komentarz nie może być pusty');
      return;
    }

    if (newComment.length > 350) {
      setError('Komentarz nie może mieć więcej niż 350 znaków');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/comment/${nagranie_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          tresc: newComment,
        }),
      });

      if (!response.ok) {
        setError('Błąd dodawania komentarza');
        return;
      }

      fetchComments();
      setNewComment('');
      setError(null);
    } catch (error) {
      setError('Błąd podczas dodawania komentarza');
    }
  };

  const handleEditComment = (commentId, currentText) => {
    setEditCommentId(commentId);
    setEditCommentText(currentText);
    setOriginalCommentText(currentText);
  };

  const handleSaveEdit = async () => {
    if (editCommentText.trim() === '') {
      setError('Komentarz nie może być pusty');
      return;
    }

    if (editCommentText.length > 350) {
      setError('Komentarz nie może mieć więcej niż 350 znaków');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/comment/${nagranie_id}/${editCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          tresc: editCommentText,
        }),
      });

      if (!response.ok) {
        setError('Błąd aktualizacji komentarza');
        return;
      }

      fetchComments();
      setEditCommentId(null);
      setEditCommentText('');
      setOriginalCommentText('');
      setError(null);
    } catch (error) {
      setError('Błąd podczas edytowania komentarza');
    }
  };

  const handleCancelEdit = () => {
    setEditCommentText(originalCommentText);
    setEditCommentId(null); 
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3000/comment/${nagranie_id}/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        setError('Błąd usuwania komentarza');
        return;
      }

      fetchComments();
    } catch (error) {
      setError('Błąd podczas usuwania komentarza');
    }
  };

  if (loading) {
    return <div className="record-page-comment-list-loading">Ładowanie komentarzy...</div>;
  }

  if (error) {
    return <div className="record-page-comment-list-error">{error}</div>;
  }

  return (
    <div className="record-page-comment-list">
      <div className="record-page-comment-list-input-container">
        <textarea
          className="record-page-comment-list-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Dodaj komentarz..."
        />
        <button className="record-page-comment-list-add-btn" onClick={handleAddComment}>
          Dodaj komentarz
        </button>
      </div>

      {comments.length > 0 ? (
        comments.map((comment) => {
          if (!comment || !comment.tresc) {
            return null;
          }

          const isOwner = user && user.id === comment.uzytkownik_id;
          const uzytkownik = users[comment.uzytkownik_id];

          if (!uzytkownik) {
            return null;
          }

          const avatarUrl = uzytkownik.photo
            ? `http://localhost:3000/${uzytkownik.photo}`
            : defaultAvatar;

          return (
            <div key={comment.id} className="record-page-comment-item">
              <div className="record-page-comment-header">
                <div className="record-page-comment-author-info">
                  <img
                    className="record-page-comment-author-image"
                    src={avatarUrl}
                    alt={`${uzytkownik.imie} ${uzytkownik.nazwisko}`}
                  />
                  <span className="record-page-comment-author-name">
                    {uzytkownik.imie} {uzytkownik.nazwisko}
                  </span>
                </div>
              </div>

              {editCommentId === comment.id ? (
                <div className='record-page-comment-edit-actions'>
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="record-page-comment-edit-input"
                  />
                  <button onClick={handleSaveEdit}>Zapisz</button>
                  <button onClick={handleCancelEdit}>Cofnij zmiany</button> 
                </div>
              ) : (
                <p className="record-page-comment-text">{comment.tresc}</p>
              )}

              {isAuthenticated && isOwner && (
                <div className="record-page-comment-actions">
                  {editCommentId !== comment.id && (
                    <button onClick={() => handleEditComment(comment.id, comment.tresc)}>Edytuj</button>
                  )}
                  {editCommentId !== comment.id && (
                    <button onClick={() => handleDeleteComment(comment.id)}>Usuń</button>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="record-page-comment-list-empty">Brak komentarzy do wyświetlenia</div>
      )}
    </div>
  );
};

export default CommentList;
