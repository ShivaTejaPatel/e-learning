
# E-Learning API

## Overview

The E-Learning API is a backend API for an e-learning platform. It provides functionality for user registration, user profile management, course management (including CRUD operations for superadmin), and user enrollment.

## API Endpoints

### Authentication

#### Sign Up
- **Endpoint**: `POST /api/auth/signup`
- **Description**: Allow users to register by providing necessary details such as name, email, and password.
- **Request Body**:
  ```json
  {
    "name": "Vaggu Raju",
    "email": "rajuyadavmry3355@gmail.com",
    "password": "shiva123"
  }
  ```
- **Responses**:
  - `201 Created`: Successful registration
  - `400 Bad Request`: Error in registration

#### Sign In
- **Endpoint**: `POST /api/auth/signin`
- **Description**: Allow users to sign in to the platform.
- **Request Body**:
  ```json
  {
    "email": "b181332@rgukt.ac.in",
    "password": "shiva123"
  }
  ```
- **Responses**:
  - `200 OK`: Successful login
  - `401 Unauthorized`: Invalid credentials

#### Sign Out
- **Endpoint**: `GET /api/auth/signout`
- **Description**: Allow users to sign out of the platform.

### User Management

#### Get User Profile
- **Endpoint**: `GET /api/user/{userId}`
- **Description**: Allow users to view their profile information.
- **Responses**:
  - `200 OK`: Successful response with user profile
  - `404 Not Found`: User not found

#### Update User Profile
- **Endpoint**: `PATCH /api/user/{userId}`
- **Description**: Allow users to update their profile information, such as name and avatar.
- **Request Body**:
  ```json
  {
    "name": "Bob ",
    "avatar": "https://example.com/avatar.jpg"
  }
  ```
- **Responses**:
  - `200 OK`: Successful update
  - `404 Not Found`: User not found

#### Update User Password
- **Endpoint**: `PATCH /api/user/update-password/{userId}`
- **Description**: Allow users to update their password.
- **Request Body**:
  ```json
  {
    "newPassword": "newpassword123"
  }
  ```
- **Responses**:
  - `200 OK`: Successful password update
  - `404 Not Found`: User not found

#### Delete User
- **Endpoint**: `DELETE /api/user/delete/{userId}`
- **Description**: Allow administrators to delete a user.
- **Responses**:
  - `204 No Content`: Successful deletion
  - `404 Not Found`: User not found

### Course Management

#### Get All Courses
- **Endpoint**: `GET /api/course`
- **Description**: Allow users to fetch the list of available courses, with filtering and pagination options.
- **Parameters**:
  - `category` (optional): Filter courses by category
  - `limit` (optional): Limit the number of courses returned per request
- **Responses**:
  - `200 OK`: Successful response with the list of courses

#### Create Course
- **Endpoint**: `POST /api/course`
- **Description**: Allow superadmin users to create a new course.
- **Request Body**:
  ```json
  {
    "title": "Mastering Kubernetes for Container Orchestration",
    "description": "Learn how to deploy, manage, and scale containerized applications with Kubernetes.",
    "category": "development",
    "level": "advanced",
    "popularity": 85
  }
  ```
- **Responses**:
  - `201 Created`: Successful creation of the course
  - `401 Unauthorized`: User is not authorized to create a course

#### Get Course by ID
- **Endpoint**: `GET /api/course/{courseId}`
- **Description**: Allow users to fetch the details of a specific course.
- **Responses**:
  - `200 OK`: Successful response with the course details
  - `404 Not Found`: Course not found

#### Update Course
- **Endpoint**: `PATCH /api/course/{courseId}`
- **Description**: Allow superadmin users to update the details of a course.
- **Request Body**:
  ```json
  {
    "category": "development"
  }
  ```
- **Responses**:
  - `200 OK`: Successful update of the course
  - `401 Unauthorized`: User is not authorized to update the course
  - `404 Not Found`: Course not found

#### Delete Course
- **Endpoint**: `DELETE /api/course/{courseId}`
- **Description**: Allow superadmin users to delete a course.
- **Responses**:
  - `204 No Content`: Successful deletion of the course
  - `401 Unauthorized`: User is not authorized to delete the course
  - `404 Not Found`: Course not found

### Enrollment

#### Enroll in a Course
- **Endpoint**: `POST /api/enroll`
- **Description**: Allow users to enroll in a course.
- **Request Body**:
  ```json
  {
    "courseId": "6613a6c88b07c914ce66ed95"
  }
  ```
- **Responses**:
  - `201 Created`: Successful enrollment
  - `400 Bad Request`: Error in enrollment
  - `401 Unauthorized`: User is not authorized to enroll in the course

#### Get Courses Enrolled by User
- **Endpoint**: `GET /api/enroll`
- **Description**: Allow users to view the courses they have enrolled in.
- **Responses**:
  - `200 OK`: Successful response with the list of enrolled courses
  - `401 Unauthorized`: User is not authorized to view the enrolled courses

## Data Models

### User
- `id`: Unique identifier for the user
- `name`: User's name
- `email`: User's email address
- `password`: User's hashed password
- `avatar`: URL of the user's profile picture
- `isSuperadmin`: Indicates whether the user is a superadmin

### Course
- `id`: Unique identifier for the course
- `title`: Course title
- `description`: Course description
- `category`: Course category
- `level`: Course level (beginner, intermediate, or advanced)
- `popularity`: Course popularity score

### Enrollment
- `id`: Unique identifier for the enrollment
- `user`: Reference to the user who enrolled in the course
- `course`: Reference to the course that the user enrolled in
- `createdAt`: Timestamp of when the enrollment was created
- `updatedAt`: Timestamp of when the enrollment was last updated

## Email Functionality

The E-Learning API utilizes Resend.com's free tier for handling email communications, including user registration confirmation, password reset requests, and course enrollment notifications.

## Logging and Error Handling

The E-Learning API uses the `morgan` middleware for logging incoming requests and responses. Additionally, it implements robust error handling mechanisms to provide meaningful error messages to clients.

## Technologies Used

- **Node.js**: Runtime environment for the backend server
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing user, course, and enrollment data
- **mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js
- **mongoose-paginate-v2**: Pagination plugin for Mongoose
- **JWT (JSON Web Tokens)**: Authentication mechanism for securing API endpoints
- **Resend.com**: Email service for sending registration confirmation, password reset, and enrollment notification emails
- **morgan**: Middleware for logging incoming requests and responses

## Getting Started

To set up the E-Learning API, follow these steps:

1. Clone the project repository.
2. Install the required dependencies using `npm install`.
3. Set up the environment variables, including the MongoDB connection string, Resend.com API keys, and Cloudinary credentials.
4. Start the server using `npm start`.
5. Import the Insomnia collection or use the provided YAML file to interact with the API endpoints.

## Conclusion

The E-Learning API provides a robust backend solution for an e-learning platform. It covers essential functionalities such as user management, course management, and user enrollment, with a focus on security, scalability, and maintainability. The API is designed to be extensible and can be integrated with various front-end applications to deliver a comprehensive e-learning experience. It also includes logging and error handling mechanisms to ensure a smooth and reliable user experience.