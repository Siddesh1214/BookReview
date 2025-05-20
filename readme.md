# Book Review API

A RESTful API built with Node.js and Express for managing books and reviews with JWT authentication.

## Features

-   User authentication with JWT
-   User roles (user and author)
-   Book management (add, view, get by ID)
-   Review system (add, update, delete reviews)
-   Role-based permissions (authors can add books)

## Tech Stack

-   **Backend**: Node.js with Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JWT (JSON Web Tokens)
-   **Cookie Management**: cookie-parser
-   **Environment Variables**: dotenv

## Project Structure

```
├── config/
│   └── db.js             # Database connection
├── controllers/
│   ├── Book.js           # Book controllers
│   ├── Review.js         # Review controllers 
│   └── User.js           # User controllers
├── middleware/
│   └── authMiddleware.js # Authentication middleware
├── models/
│   ├── Book.js           # Book model
│   ├── Review.js         # Review model
│   └── User.js           # User model
├── routes/
│   ├── Book.js           # Book routes
│   ├── Review.js         # Review routes
│   └── User.js           # User routes
├── .env                  # Environment variables
├── server.js             # Server entry point
└── README.md             # Project documentation

```

## Database Schema

### User Model

The User model contains authentication and role information with the following fields:

-   **username**: Unique identifier for the user (string, required)
-   **password**: User's password (string, required)
-   **email**: User's email address (string, required, unique) (Primary Key)
-   **role**: User role with possible values 'user' or 'author' (defaults to 'user')

### Book Model

The Book model stores information about books with timestamps and includes:

-   **title**: Book title (string, required)
-   **author**: Name of the book's author (string, required)
-   **genre**: Book genre (string)
-   **createdBy**: Reference to the User who added the book (ObjectId)
-   **reviews**: Array of references to associated Review documents

### Review Model

The Review model stores book reviews with timestamps and includes:

-   **content**: Text content of the review (string, required)
-   **rating**: Numeric rating from 1-5 (number, required)
-   **user**: Reference to the User who wrote the review (ObjectId)
-   **book**: Reference to the Book being reviewed (ObjectId)

## API Endpoints

### Authentication

-   `POST /api/v1/user/signup` - Register a new user
-   `POST /api/v1/user/login` - Login and get JWT token

### Books

-   `POST /api/v1/book/books` - Add a new book (authenticated, author role only)
-   `GET /api/v1/book/books` - Get all books
-   `GET /api/v1/book/books/:id` - Get book details by ID

### Reviews

-   `POST /api/v1/book/books/:id/reviews` - Submit a review for a book (authenticated user only)
-   `PUT /api/v1/review/reviews/:id` - Update a review (own reviews only)
-   `DELETE /api/v1/review/reviews/:id` - Delete a review (own reviews only)

## Setup Instructions

### Prerequisites

-   Node.js (18 or higher)
-   MongoDB instance (local or Atlas)
-   npm or yarn

### Installation

1.  Clone the repository
    
    ```bash
    git clone https://github.com/Siddesh1214/BookReview
    cd book-review-api
    
    ```
    
2.  Install dependencies
    
    ```bash
    npm install
    
    ```
    
3.  Create a `.env` file in the root directory with the following variables:
    
    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/book-review-api
    JWT_SECRET=your_jwt_secret_key
    ```
    
4.  Start the server
    
    ```bash
    npm start
    ```
    
    For development with auto-reload:
    
    ```bash
    npm run dev    
    ```
    

## Design Decisions

1.  **Authentication System**:
    
    -   JWT-based authentication for stateless API calls
    -   Role-based access control (user vs author roles)
    -   Cookie management for storing authentication tokens
2.  **Database Structure**:
    
    -   MongoDB chosen with Mongoose ORM
    -   Separate models for users, books, and reviews
    -   References between collections for data relationships
    -   Timestamps for tracking creation and update times
3.  **API Design**:
    
    -   RESTful design principles
    -   Versioned API endpoints (/api/v1)
    -   Clear resource-based URL structure
    -   Role-based authorization (authors can add books)
4.  **Security Considerations**:
    
    -   JWT authentication
    -   Role-based permissions
    -   Environment variables for sensitive information
    -   Users can only modify their own reviews

## Error Handling

The API returns appropriate HTTP status codes:

-   200: Success
-   201: Resource created
-   400: Bad request (validation errors)
-   401: Unauthorized
-   403: Forbidden
-   404: Resource not found
-   500: Server error

## License

MIT