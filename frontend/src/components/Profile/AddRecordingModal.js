import React, { useState } from 'react';
import Modal from 'react-modal';
import { storage } from '../../firebaseConfig'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

Modal.setAppElement('#root'); 

const AddRecordingModal = ({ isOpen, onRequestClose, userId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

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

            const response = await fetch(`http://localhost:3000/user/${userId}/records`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    url, 
                }),
            });

            if (response.ok) {
                onRequestClose();
                setTitle('');
                setDescription('');
                setFile(null);
            } else {
                console.error('Błąd podczas dodawania nagrania');
            }
        } catch (error) {
            console.error('Błąd podczas przesyłania pliku do Firebase:', error);
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
        </Modal>
    );
};

export default AddRecordingModal;
