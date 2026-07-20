# Salon E-Commerce Backend

A complete backend for a salon e-commerce website built with Node.js, Express, MongoDB Atlas, and JWT authentication.

## Features

- Authentication (register, login, logout)
- User profile management
- Categories and products management
- Services and stylists modules
- Appointments booking
- Cart and order handling
- Contact form storage
- Admin dashboard metrics

## Project Structure

backend/
│── config/
│── controllers/
│── middleware/
│── models/
│── routes/
│── uploads/
│── utils/
│── app.js
│── server.js
│── package.json

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file based on `.env.example` and fill in your MongoDB Atlas credentials.

3. Run the app:
   ```bash
   npm run dev
   ```

4. API base URL:
   ```
   http://localhost:5000/api
   ```

## API Notes

- Authentication is JWT based with secure cookies.
- Image uploads are stored in `backend/uploads`.
- Use Postman or similar to test the routes.
