const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { toggleLike } = require("../controllers/likeController");

router.post("/", authMiddleware, toggleLike);

module.exports = router;
