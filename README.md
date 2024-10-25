# Product API

This is a simple RESTful API for managing products, built with Node.js, Express, and MongoDB. The API allows you to create, read, update, and delete products.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Get All Products](#get-all-products)
  - [Get a Single Product](#get-a-single-product)
  - [Create a Product](#create-a-product)
  - [Update a Product](#update-a-product)
  - [Delete a Product](#delete-a-product)
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

3. Create a `.env` file in the root directory and configure it with your MongoDB URI and the port number (see [Environment Variables](#environment-variables)).

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
```

## Usage

To start the server, run:

```bash
npm start
```

You can test the API endpoints using Postman, cURL, or your preferred API testing tool.

## API Endpoints

### Get All Products

- **URL**: `/api/products`
- **Method**: `GET`
- **Description**: Fetches all products in the database.
- **Response**:
  - Status: `200 OK`
  - Body: Array of product objects

### Get a Single Product

- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Description**: Fetches a single product by ID.
- **Response**:
  - Status: `200 OK` (Product found) or `404 Not Found` (Product not found)
  - Body: Product object

### Create a Product

- **URL**: `/api/products`
- **Method**: `POST`
- **Description**: Creates a new product.
- **Request Body**:
  - JSON object with product details (e.g., `name`, `price`, `description`, etc.)
- **Response**:
  - Status: `200 OK`
  - Body: Created product object

### Update a Product

- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Description**: Updates an existing product by ID.
- **Request Body**:
  - JSON object with updated product fields.
- **Response**:
  - Status: `200 OK` (Product updated) or `404 Not Found` (Product not found)
  - Body: Updated product object

### Delete a Product

- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Description**: Deletes a product by ID.
- **Response**:
  - Status: `200 OK` (Product deleted) or `404 Not Found` (Product not found)
  - Body: Success message

## Error Handling

Errors are returned in JSON format with a `message` field explaining the error. Common errors include:

- `500 Internal Server Error`: Database or server issues
- `404 Not Found`: Product not found

---