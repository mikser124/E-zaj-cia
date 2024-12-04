const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', userController.getUserProfile); 
router.get('/', authMiddleware, userController.getUsers);

router.put('/:id', authMiddleware, userController.updateUserProfile);
router.put('/:id/update-description', authMiddleware, userController.updateDescription);

router.post('/:id/update-photo', authMiddleware, userController.updatePhoto); 
router.post('/:id/update-banner', authMiddleware, userController.updateBanner);

router.post('/:id/records', authMiddleware, userController.addRecord); 

module.exports = router;
