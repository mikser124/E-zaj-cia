const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', userController.getUserProfile); 

router.put('/:id', authMiddleware, userController.updateUserProfile);

router.post('/:id/update-photo', authMiddleware, userController.updatePhoto); 
router.post('/:id/update-banner', authMiddleware, userController.updateBanner);

router.post('/:id/records', authMiddleware, userController.addRecord); 

module.exports = router;
