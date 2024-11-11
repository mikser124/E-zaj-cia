const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:nagranie_id', authMiddleware, commentController.addComment);

router.get('/:nagranie_id', commentController.getComments);

router.put('/:comment_id', authMiddleware, commentController.updateComment);

router.delete('/:comment_id', authMiddleware, commentController.deleteComment);

module.exports = router;
