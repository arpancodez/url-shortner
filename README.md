# URL Shortener Service

A simple URL shortener web application built with Node.js, Express, TypeScript, and MongoDB.  
The app allows users to input a long URL and generates a short, easily shareable URL that redirects to the original.

## Features

- Shorten long URLs to short keys
- Redirect short URLs to original URLs
- Simple admin dashboard to view all URLs and their click counts
- Basic error handling and validation
- Frontend form for easy URL submission
- API routes for integration or custom frontends

## Technologies Used

- Node.js & Express (backend)
- TypeScript for type safety
- MongoDB + Mongoose for database
- Axios for HTTP requests (frontend)
- Basic HTML/CSS for UI

## Project Structure

- `index.ts`: Main server file, sets up Express, routing, and database connection
- `routes/`: API route handlers (auth, admin, URLs)
- `models/`: Mongoose schemas for URLs and Users
- `public/`: Static files served (including frontend HTML form)
- `README.md`: Project documentation

## Installation

1. Clone the repository  
git clone <repo-url>

2. Install dependencies  
npm install

3. Setup and start MongoDB server  
- Install MongoDB Community edition if not installed  
- Run `mongod` to start MongoDB service

4. Run the development server  
npm run dev

5. Open your browser at  
http://localhost:3000

Use the form to submit URLs for shortening.

## Usage

- Submit a URL in the input field on the main page and click **Shorten**  
- The app returns a shortened URL to share or use
- Access the admin dashboard at  `http://localhost:3000/admin/admin.html` for URL management

## Notes

- Make sure MongoDB is running locally on port 27017
- This app is for learning/demo purposes, and can be extended with user authentication, analytics, etc.

## License

This project is licensed under the MIT License.

---
