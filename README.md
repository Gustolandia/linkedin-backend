# LinkedIn Clone Backend

## Introduction

This project is a backend clone of LinkedIn, developed using Express.js. It's a simplified version of LinkedIn's actual backend, focusing on core functionalities such as profile management, experience handling, and post services.

## Features

- User Authentication and Authorization
- Profile Management
- Experience Management
- Posts Creation and Management

## Endpoints

### Profile and Experience Services

#### Profile
- `GET /me`: Get the current user's profile
- `GET /:username`: Get a specific user's profile
- `POST /:username/picture`: Upload a profile picture
- `POST /`: Sign up a new user
- `PUT /`: Update user profile

#### Experience
- `GET /:username/experiences`: Get experiences for a user
- `POST /:username/experiences`: Add an experience
- `POST /:username/experiences/:expId/picture`: Upload a picture for a specific experience

### Authentication
- `POST /login`: Log in a user
- `POST /logout`: Log out the current user
- `POST /logoutAll`: Log out all sessions for the current user
- `POST /refreshToken`: Refresh authentication token

### Post Services
- `GET /:postId`: Get a specific post
- `POST /:postId/picture`: Upload a picture for a specific post
- `GET /`: Get all posts
- `POST /:username`: Create a new post
- `PUT /:postId`: Update a specific post
- `DELETE /:postId`: Delete a specific post

## Environment Variables

To deploy this project, you need to set the following environment variables (values provided here are placeholders):

- `NODE_ENV`: Environment setting (e.g., development)
- `PORT`: Port number for the server (e.g., 3003)
- `JWT_SECRET`: Secret key for JWT authentication
- `REFRESH_JWT_SECRET`: Secret key for JWT refresh token

## Setup and Installation

To set up and run the LinkedIn Clone Backend, follow these steps:

1. Clone the repository to your local machine.

2. Install the necessary dependencies by running:
npm install

3. Set up the required environment variables. Create a `.env` file in the root directory and include the following:
NODE_ENV=development
PORT=3003
JWT_SECRET=your_jwt_secret
REFRESH_JWT_SECRET=your_refresh_jwt_secret

4. To start the server, you have several script options defined in your `package.json`:

- To run tests:
  ```
  npm run test
  ```

- For development, using nodemon for automatic server restarts on code changes:
  ```
  npm run dev
  ```

- To debug the application:
  ```
  npm run debug
  ```

- To start the server in production mode:
  ```
  npm start
  ```

Replace the JWT secret values with your own secure keys.

## License

Free for usage, give proper credit. 
