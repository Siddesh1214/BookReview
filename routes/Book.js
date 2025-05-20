const express = require('express');
const { addBook, getBooks, getBookById } = require('../controllers/Book');
const { authMiddleware, checkAuthor } = require('../middleware/authMiddleware');
const { addReview } = require('../controllers/Review');
const router = express.Router();


router.post('/books', authMiddleware, checkAuthor, addBook);
router.post('/books/:id/reviews', authMiddleware, addReview);
router.get('/books', getBooks);
router.get('/books/:id', getBookById);

module.exports = router;