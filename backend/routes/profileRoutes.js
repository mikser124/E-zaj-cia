const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id',  profileController.getProfile); 
router.put('/:id', authMiddleware, profileController.updateProfile);

router.put('/:id/photo', authMiddleware, profileController.updatePhoto);
router.put('/:id/banner', authMiddleware, profileController.updateBanner);

router.get('/:id/records', profileController.getRecordsByUserId); 
router.post('/:id/records', authMiddleware, profileController.addRecord); 

module.exports = router;
