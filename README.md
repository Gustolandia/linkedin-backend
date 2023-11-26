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

  "scripts": {
    "test": "jest",
    "dev": "nodemon -r dotenv/config ./src/server.js",
    "debug": "nodemon --inspect -r dotenv/config ./src/server.js",
    "start": "node ./src/server.js"
  },


## License

Free for usage, give proper credit. 
