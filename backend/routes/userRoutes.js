const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Zmieniamy nazwę importu
const authMiddleware = require('../middleware/authMiddleware');

// Pobieranie danych użytkownika
router.get('/:id', userController.getUserProfile); 

// Aktualizacja danych użytkownika
router.put('/:id', authMiddleware, userController.updateUserProfile);

// Aktualizacja zdjęcia użytkownika
router.put('/:id/photo', authMiddleware, userController.updatePhoto);

// Aktualizacja banera użytkownika
router.put('/:id/banner', authMiddleware, userController.updateBanner);

// Dodawanie nagrania przez użytkownika
router.post('/:id/records', authMiddleware, userController.addRecord); 

module.exports = router;
