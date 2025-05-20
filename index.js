const express = require('express');
const connectDB = require('./config/db');
const app = express();
const userRoutes = require('./routes/User');
const bookRoutes=require('./routes/Book');
const reviewRoutes=require('./routes/Review');
const cookieParser = require('cookie-parser');

require('dotenv').config();

connectDB();

app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 3000;

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/book', bookRoutes);
app.use('/api/v1/review', reviewRoutes);




app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Welcome to the API',
  })
});


app.listen(PORT, () => {
  console.log(`server is working on http://localhost:${PORT}`);
})