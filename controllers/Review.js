const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');


exports.addReview = async (req, res) => {
  const { id: bookId } = req.params;  //book id in params
  const { content, rating } = req.body;

  // console.log(first)

  if (!content || !rating) {
    return res.status(400).json({ message: 'Content and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
        success:false,
      })
    }
    const existingReview = await Review.findOne({ book: bookId, user: req.user.userId });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already given the review for this book",
        success:false,
      })
    }
    const review = await Review.create({
      content,
      rating,
      user: req.user.userId,
      book: bookId
    });

    book.reviews.push(review._id);
    await book.save();

    res.status(201).json({
      message: 'Review added successfully',
      book,
      review,
      success:true,
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error,
      success:false,
    });
  }
}


exports.updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { content, rating } = req.body;

  // console.log(first)
  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({
      message: 'Review not found',
      success:false
    });
    
    if (review.user.toString() !== req.user.userId.toString()) {
      return res.status(402).json({
        message: 'Unauthorized to edit the review',
        success:false
      });
    }
    
    if (content) review.content = content;
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: 'Rating must be between 1 and 5',
          success:false
        });
      }
      review.rating = rating;
    }

    await review.save();

    res.status(201).json({
      message: 'Review updated successfully',
      review,
      success:true,
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server error',
      error,
      success:false,
    });
  }

}


exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({
      message: 'Review not found',
      success:false
    });
    
    if (review.user.toString() !== req.user.userId.toString()) {
      return res.status(402).json({
        message: 'Unauthorized to edit the review',
        success:false
      });
    }

    const updatedBook = await Book.findByIdAndUpdate({ _id: review.book },
      { $pull: { reviews: review._id } },
      { new: true }
    );

    await review.deleteOne();
    res.status(200).json({
      message: 'Review deleted',
      updatedBook,
      success:true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server error',
      error,
      success:false,
    });
  }
}