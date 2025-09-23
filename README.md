# Simple URL Shortener

A minimal Node.js URL shortener API built with Express.  
This project lets you create short URLs and redirect to the original URLs instantly.

---

## Features

- Shorten any valid URL to a unique 6-character code  
- Redirect short URLs to their original URLs  
- In-memory storage (no external database, perfect for learning and prototyping)  

---

## Getting Started

### Prerequisites

- Node.js and npm installed  
- Basic knowledge of TypeScript  

### Installation

1. Save the code as `index.ts`

2. Install dependencies:

npm install express body-parser @types/express @types/body-parser

text

3. Run the server using ts-node:

npx ts-node index.ts

text

---

## Usage

- To create a short URL, send a POST request to:

http://localhost:3000/shorten

text

- Request body (JSON):

{
"url": "https://example.com"
}

text

- The response will contain your shortened URL:

{
"shortUrl": "http://localhost:3000/abc123"
}

text

- Visit the shortened URL in your browser (e.g., `http://localhost:3000/abc123`) to be redirected to the original URL.

---

## Notes

- This implementation stores URLs in memory, so all data will be lost when the server restarts.  
- For deployment or production, integrate a persistent database.  
- Input URL validation is minimal; consider adding more robust checks for your use case.

---

## License

MIT License

---

## Author

Arpan. - [GitHub](https://github.com/arpancodez)
