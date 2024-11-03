  # Product and User API

This is a RESTful API for managing products and users, built with Node.js, Express, and MongoDB. It includes authentication for protected routes using JSON Web Tokens (JWT).

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Authentication](#user-authentication)
  - [Product Management](#product-management)
- [Error Handling](#error-handling)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tharathep326/node-mongo-rest-api-.git
   cd myapp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure it with your MongoDB URI, port number, and JWT secret key (see [Environment Variables](#environment-variables)).

4. Start the server:

   ```bash
   npm start
   ```

The server should now be running at `http://localhost:3000` (or the port you set in the `.env` file).

## Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```plaintext
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
PORT=3000
ACCESS_TOKEN_SECRET=your_jwt_secret
```

## Usage

To start the server, run:

```bash
npm start
```

You can test the API endpoints using Postman, cURL, or your preferred API testing tool.

## API Endpoints

### User Authentication

#### Register a User

- **URL**: `/api/user/register`
- **Method**: `POST`
- **Description**: Registers a new user with a username and password.
- **Request Body**:
  - JSON object with `username` and `password`
- **Response**:
  - Status: `201 Created`
  - Body: Username of the created user

#### Login

- **URL**: `/api/user/login`
- **Method**: `POST`
- **Description**: Logs in an existing user, returning an access token.
- **Request Body**:
  - JSON object with `username` and `password`
- **Response**:
  - Status: `200 OK`
  - Body: Access token for authorized requests

### Product Management

These endpoints require a valid access token in the `Authorization` header, formatted as `Bearer <token>`.

#### Get All Products

- **URL**: `/api/products`
- **Method**: `GET`
- **Description**: Fetches all products in the database.
- **Response**:
  - Status: `200 OK`
  - Body: Array of product objects

#### Get a Single Product

- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Description**: Fetches a single product by ID.
- **Response**:
  - Status: `200 OK` (Product found) or `404 Not Found` (Product not found)
  - Body: Product object

#### Create a Product

- **URL**: `/api/products`
- **Method**: `POST`
- **Description**: Creates a new product.
- **Request Body**:
  - JSON object with product details (e.g., `name`, `price`, `description`, etc.)
- **Response**:
  - Status: `201 Created`
  - Body: Created product object

#### Update a Product

- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Description**: Updates an existing product by ID.
- **Request Body**:
  - JSON object with updated product fields.
- **Response**:
  - Status: `200 OK` (Product updated) or `404 Not Found` (Product not found)
  - Body: Updated product object

#### Delete a Product

- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Description**: Deletes a product by ID.
- **Response**:
  - Status: `200 OK` (Product deleted) or `404 Not Found` (Product not found)
  - Body: Success message

## Error Handling

Errors are returned in JSON format with a `message` field explaining the error. Common errors include:

- `500 Internal Server Error`: Database or server issues
- `404 Not Found`: Resource not found
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Invalid or expired token

## Sample Code Snippets

### Middleware Setup

```javascript
//middlewares/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = authMiddleware;
```

### User Controller Setup

```javascript
// controllers/auth.controller.js
const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
        });

        res.status(201).json({ username: user.username });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const accessToken = generateAccessToken(user);
        res.status(200).json({ message: 'Login successful', accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
    );
};

module.exports = { createUser, login };
```

### Example Usage in Express

```javascript
const express = require('express');
const mongoose = require('mongoose');
const productRoute = require('./routes/product.route.js');
const userRoute = require('./routes/user.route.js');
const authMiddleware = require('./middlewares/auth.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Protected routes
app.use('/api/products', authMiddleware, productRoute);
app.use('/api/user', userRoute);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to database');
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch(() => {
        console.log('Connection failed');
    });
```

--- 

This `README.md` now includes complete setup instructions, code snippets, and example usage, which should cover the project's functionality and usage comprehensively.