import React, { useState } from 'react';
import Modal from 'react-modal';
import { storage } from '../../firebaseConfig'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';  // Importowanie axios

Modal.setAppElement('#root'); 

const AddRecordingModal = ({ isOpen, onRequestClose, userId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            console.error('Brak pliku do przesłania');
            return;
        }

        const fileRef = ref(storage, `uploads/records/${userId}/${file.name}`);

        try {
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef); 

            // Użycie axios zamiast fetch
            const response = await axios.post(
                `http://localhost:3000/user/${userId}/records`,
                {
                    title,
                    description,
                    url,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                setIsSuccess(true); // Ustawienie stanu sukcesu
                onRequestClose(); // Zamknięcie modalu
                setTitle('');
                setDescription('');
                setFile(null);
            } else {
                console.error('Błąd podczas dodawania nagrania');
                setIsError(true); // Ustawienie stanu błędu
            }
        } catch (error) {
            console.error('Błąd podczas przesyłania pliku do Firebase:', error);
            setIsError(true); // Ustawienie stanu błędu
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Dodaj nagranie"
        >
            <h2>Dodaj nagranie</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Tytuł:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Opis:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Plik:
                        <input
                            type="file"
                            onChange={handleFileChange}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Dodaj</button>
                <button type="button" onClick={onRequestClose}>Anuluj</button>
            </form>

            {isSuccess && <p style={{ color: 'green' }}>Nagranie zostało dodane pomyślnie!</p>}
            {isError && <p style={{ color: 'red' }}>Wystąpił błąd podczas dodawania nagrania. Spróbuj ponownie.</p>}
        </Modal>
    );
};

export default AddRecordingModal;
