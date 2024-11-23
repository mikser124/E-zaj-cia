const express = require('express');
const { givePoints } = require('../controllers/pointController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:prowadzacy_id', authMiddleware, givePoints);

module.exports = router;
