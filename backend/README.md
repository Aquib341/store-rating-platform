# Store Rating Platform

## Overview
The Store Rating Platform is a web application built with Express.js that allows users to rate and review various stores. This project utilizes Sequelize for database interactions and implements JWT for user authentication.

## Features
- User authentication with JWT
- Store rating and review functionality
- RESTful API design
- Middleware for authentication and error handling

## Technologies Used
- Node.js
- Express.js
- Sequelize
- PostgreSQL
- bcryptjs for password hashing
- jsonwebtoken for authentication
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- PostgreSQL

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd store-rating-platform/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory and add your database credentials and secret keys:
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application
To start the server, use:
```
npm run dev
```
This will run the application using Nodemon, which automatically restarts the server on file changes.

### API Endpoints
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in an existing user
- `GET /api/stores`: Retrieve a list of stores
- `POST /api/stores/:id/rate`: Rate a specific store

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License
This project is licensed under the MIT License.