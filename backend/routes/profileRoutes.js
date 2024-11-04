const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id', authMiddleware, profileController.getProfile); 
router.put('/:id', authMiddleware, profileController.updateProfile); 
router.put('/:id/photo', authMiddleware, upload.single('photo'), profileController.updatePhoto);
router.put('/:id/banner', authMiddleware, upload.single('banner'), profileController.updateBanner);

module.exports = router;
