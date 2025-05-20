const express = require('express');
const { updateReview, deleteReview } = require('../controllers/Review');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();



router.put('/reviews/:id', authMiddleware, updateReview);
router.delete('/reviews/:id', authMiddleware, deleteReview);

module.exports = router;