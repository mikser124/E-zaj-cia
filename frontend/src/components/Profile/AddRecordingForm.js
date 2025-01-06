import React, { useState, useEffect } from 'react';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

import '../../styles/AddRecordingForm.css';

const AddRecordingForm = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); 
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/categories', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setCategories(response.data);
                setFilteredCategories(response.data);
            } catch (error) {
                console.error('Błąd podczas pobierania kategorii:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleNewCategoryChange = (e) => {
        const value = e.target.value;
        setNewCategory(value);

        if (value) {
            const filtered = categories.filter((category) =>
                category.nazwa.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categories);
        }
    };

    const handleCategorySelect = (categoryName, categoryId) => {
        setNewCategory(categoryName);
        setSelectedCategory(categoryId);
        setFilteredCategories([]); 
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    console.log('Wybrana kategoria:', selectedCategory);
    console.log('Nowa kategoria:', newCategory);
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file) {
            console.error('Brak pliku do przesyłania');
            return;
        }
    
        if (!newCategory && !selectedCategory) {
            alert("Wybierz kategorię lub wpisz nową");
            return;
        }
    
        const fileRef = ref(storage, `uploads/records/${user.id}/${file.name}`);
        setIsLoading(true); 
    
        const uploadTask = uploadBytesResumable(fileRef, file);
    
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress); 
            },
            (error) => {
                console.error('Błąd podczas przesyłania pliku do Firebase:', error);
                setIsError(true);
                setIsLoading(false); 
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
    
                let categoryId = selectedCategory;
    
                if (newCategory && !selectedCategory) {
                    const existingCategory = categories.find(category => category.nazwa.toLowerCase() === newCategory.toLowerCase());
    
                    if (existingCategory) {
                        categoryId = existingCategory.id;
                    } else {
                        const createCategoryResponse = await axios.post(
                            'http://localhost:3000/api/categories',
                            { nazwa: newCategory },
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                                },
                            }
                        );
                        categoryId = createCategoryResponse.data.id;
                        console.log('Utworzona kategoria:', createCategoryResponse.data);
                    }
                }
    
                try {
                    const response = await axios.post(
                        `http://localhost:3000/user/${user.id}/records`,
                        {
                            title,
                            description,
                            url,
                            kategoria_id: categoryId,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }
                    );
    
                    if (response.status === 200 || response.status === 201) {
                        setIsSuccess(true);
                        setTitle('');
                        setDescription('');
                        setFile(null);
                        setSelectedCategory('');
                        setNewCategory('');
                        setFilteredCategories(categories);
                    } else {
                        console.error('Błąd podczas dodawania nagrania, odpowiedź: ', response);
                        setIsError(true);
                    }
                } catch (error) {
                    console.error('Błąd przy komunikacji z backendem:', error);
                    setIsError(true);
                }
    
                setIsLoading(false); 
            }
        );
    };

    return (
        <div className="add-recording-page-form-container">
            <h2 className="add-recording-page-h2">Dodaj nagranie</h2>
            <form onSubmit={handleSubmit} className="add-recording-page-form">
                <div className="add-recording-page-div">
                    <label className="add-recording-page-label">
                        Tytuł:
                        <input
                            className="add-recording-page-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className="add-recording-page-div">
                    <label className="add-recording-page-label">
                        Opis:
                        <textarea
                            className="add-recording-page-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className="add-recording-page-div">
                    <label className="add-recording-page-label">
                        Plik:
                        <input
                            className="add-recording-page-input"
                            type="file"
                            onChange={handleFileChange}
                            required
                        />
                    </label>
                </div>

                <div className="add-recording-page-div" style={{ position: 'relative' }}>
                    <label className="add-recording-page-label">
                        Kategoria:
                        <input
                            className="add-recording-page-input"
                            type="text"
                            value={newCategory}
                            onChange={handleNewCategoryChange}
                            placeholder="Wpisz kategorię"
                        />
                    </label>
                    {filteredCategories.length > 0 && newCategory && (
                        <ul className="category-suggestions">
                            {filteredCategories.map((category) => (
                                <li
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category.nazwa, category.id)}
                                    className="category-suggestion-item"
                                >
                                    {category.nazwa}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="add-recording-page-div">
                    <button className="add-recording-page-button" type="submit" disabled={isLoading}>
                        {isLoading ? 'Ładowanie...' : 'Dodaj'}
                    </button>
                </div>
            </form>

            {isSuccess && (
                <p className="add-recording-page-p add-recording-page-p-green">
                    Nagranie zostało dodane pomyślnie!
                </p>
            )}
            {isError && (
                <p className="add-recording-page-p add-recording-page-p-red">
                    Wystąpił błąd podczas dodawania nagrania. Spróbuj ponownie.
                </p>
            )}

            {isLoading && (
                <div className="loader">
                    <p>Trwa ładowanie: {Math.round(uploadProgress)}%</p>
                </div>
            )}
        </div>
    );
};

export default AddRecordingForm;
