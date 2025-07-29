# URL Shortener Backend

This project is a simple backend service for shortening URLs, built with Node.js, Express, and MongoDB.

## Features
- Create short URLs for any valid URL
- Custom shortcodes (optional)
- Set validity period for each short URL
- Redirect to original URL using the shortcode
- Logging middleware for request tracking

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- dotenv for environment variable management

## Getting Started

### Prerequisites
- Node.js (v18 or above recommended)
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add the following variables:
   ```env
   MONGO_URI=<your-mongodb-uri>
   PORT=3000
   HOST=http://localhost:3000
   ```

### Running the Server
```sh
npm start
```

The server will start and connect to MongoDB. You can access the API at `http://localhost:3000` (or your configured host).

## API Endpoints

### Create Short URL
- **POST** `/shorturls`
- **Body:**
  ```json
  {
    "url": "https://example.com",
    "validity": 30, // in minutes (optional, default: 30)
    "shortcode": "custom123" // optional
  }
  ```
- **Response:**
  ```json
  {
    "shortUrl": "http://localhost:3000/custom123"
  }
  ```

### Redirect to Original URL
- **GET** `/:shortcode`
- Redirects to the original URL if valid and not expired.

## Folder Structure
```
index.js
middleware/
models/
routes/
utils/
```

## License
This project is for educational and demonstration purposes only.
