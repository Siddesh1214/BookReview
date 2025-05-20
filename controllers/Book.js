const Book = require('../models/Book');
const Review = require('../models/Review');

exports.addBook = async (req, res) => {
  const { title, author, genre } = req.body;
  if (!title || !author) return res.status(400).json({
    message: 'Title and author are required',
    success:false,
  });

  // console.log('Checking the user ', req.user);
  try {
    const book = await Book.create({
      title,
      author,
      genre,
      createdBy: req.user.userId,
      reviews: []
    });
    console.log('book object ', book);
    res.status(201).json({
      message: 'Book added successfully',
      book: book,
      success:true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error,
      success:false,
    });
  }
};

exports.getBooks = async (req, res) => {
  const { author, genre, title } = req.query;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);


  const filter = {};
  if (author) filter.author = new RegExp(author, 'i');
  if (genre) filter.genre = new RegExp(genre, 'i');
  if (title) filter.title = new RegExp(title, 'i');
  console.log('filter obj ', filter);

  try {
    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('createdBy', 'username');

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      books
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server error',
      error,
      success: false
    });
  }
};



exports.getBookById = async (req, res) => {
  const { id: bookId } = req.params;
  // const { page = 1, limit = 5 } = req.query;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 5, 1);

  console.log('page = ', page, ' ---- limit = ', limit);

  try {
    const book = await Book.findById(bookId).populate('createdBy', 'username');
    if (!book) return res.status(404).json({
      message: 'Book not found',
      success: false,
    });

    const reviews = await Review.find({ book: bookId })
      .populate('user', 'username')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const ratingsAgg = await Review.aggregate([
      { $match: { book: book._id } },
      {
        $group: {
          _id: '$book',
          avgRating: { $avg: '$rating' },
        }
      }
    ]);

    console.log('ratingsAgg ', ratingsAgg);
    const avgRating = ratingsAgg[0]?.avgRating || 0;
    const reviewsCount = book?.reviews?.length || 0;

    res.status(200).json({
      book,
      averageRating: avgRating.toFixed(2),
      reviews,
      total: reviewsCount,
      page: Number(page),
      limit: Number(limit),
      success: true
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Server error',
      error,
      success: false,
    });
  }
};



