# URL Shortener API

A simple and efficient URL shortener service built with Node.js, Express.js, and MongoDB. This API allows you to create short URLs, track click analytics, and manage custom aliases.

## Features

- ✅ **URL Shortening**: Convert long URLs into short, shareable links
- ✅ **Custom Aliases**: Create custom short codes for your URLs
- ✅ **Click Tracking**: Monitor how many times each short URL has been clicked
- ✅ **Expiration Dates**: Set expiration dates for short URLs
- ✅ **Analytics**: Get detailed statistics for each short URL
- ✅ **Input Validation**: Comprehensive validation for all inputs
- ✅ **Error Handling**: Proper error responses and status codes
- ✅ **Web Interface**: Beautiful, responsive frontend with modern UI
- ✅ **Real-time Analytics**: View click statistics and URL information
- ✅ **Copy to Clipboard**: One-click copying of shortened URLs

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Validation**: express-validator
- **Short Code Generation**: nanoid
- **Environment**: dotenv
- **UI Framework**: Custom CSS with Font Awesome icons

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/urlshortener
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system. You can use:

   - Local MongoDB installation
   - MongoDB Atlas (cloud)
   - Docker: `docker run -d -p 27017:27017 mongo`

5. **Run the application**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## Frontend Access

Once the server is running, you can access the web interface at:

- **Frontend**: `http://localhost:3000` (main page)
- **API**: `http://localhost:3000/api` (API endpoints)

## API Endpoints

### 1. Create Short URL

**POST** `/api/shorten`

Create a new short URL from a long URL.

**Request Body:**

```json
{
  "originalUrl": "https://www.example.com/very/long/url/path",
  "customAlias": "my-custom-link", // Optional
  "expiresAt": "2024-12-31T23:59:59.000Z" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "originalUrl": "https://www.example.com/very/long/url/path",
    "shortUrl": "http://localhost:3000/abc123",
    "shortCode": "abc123",
    "customAlias": false,
    "expiresAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Redirect to Original URL

**GET** `/:shortCode`

Redirect to the original URL using the short code.

**Example:** `GET http://localhost:3000/abc123`

**Response:** 301 Redirect to the original URL

### 3. Get URL Statistics

**GET** `/api/stats/:shortCode`

Get analytics and statistics for a short URL.

**Example:** `GET http://localhost:3000/api/stats/abc123`

**Response:**

```json
{
  "success": true,
  "data": {
    "originalUrl": "https://www.example.com/very/long/url/path",
    "shortCode": "abc123",
    "customAlias": false,
    "clicks": 42,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastAccessedAt": "2024-01-15T15:45:00.000Z",
    "expiresAt": null,
    "isExpired": false
  }
}
```

### 4. Delete Short URL

**DELETE** `/api/url/:shortCode`

Delete a short URL and its associated data.

**Example:** `DELETE http://localhost:3000/api/url/abc123`

**Response:**

```json
{
  "success": true,
  "message": "Short URL deleted successfully",
  "data": {
    "shortCode": "abc123",
    "originalUrl": "https://www.example.com/very/long/url/path"
  }
}
```

## Usage Examples

### Using cURL

1. **Create a short URL:**

   ```bash
   curl -X POST http://localhost:3000/api/shorten \
     -H "Content-Type: application/json" \
     -d '{"originalUrl": "https://www.google.com"}'
   ```

2. **Create with custom alias:**

   ```bash
   curl -X POST http://localhost:3000/api/shorten \
     -H "Content-Type: application/json" \
     -d '{"originalUrl": "https://www.github.com", "customAlias": "github"}'
   ```

3. **Get statistics:**
   ```bash
   curl http://localhost:3000/api/stats/github
   ```

### Using JavaScript/Fetch

```javascript
// Create short URL
const response = await fetch("http://localhost:3000/api/shorten", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    originalUrl: "https://www.example.com",
    customAlias: "example",
  }),
});

const data = await response.json();
console.log(data.data.shortUrl); // http://localhost:3000/example
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Short URL not found
- **409 Conflict**: Custom alias already exists
- **410 Gone**: Short URL has expired
- **500 Internal Server Error**: Server error

**Error Response Format:**

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": [] // Validation errors (if applicable)
}
```

## Database Schema

The URL collection stores the following fields:

```javascript
{
  originalUrl: String,      // The original long URL
  shortCode: String,        // Unique short code (4-10 chars)
  customAlias: Boolean,     // Whether it's a custom alias
  clicks: Number,           // Click count (default: 0)
  createdAt: Date,          // Creation timestamp
  expiresAt: Date,          // Expiration date (optional)
  lastAccessedAt: Date      // Last click timestamp
}
```

## Development

### Project Structure

```
url-shortener/
├── src/
│   ├── models/
│   │   └── Url.js           # MongoDB schema
│   ├── routes/
│   │   └── url.routes.js    # API routes
│   ├── controllers/
│   │   └── url.controller.js # Business logic
│   ├── middleware/
│   │   └── validation.js     # Input validation
│   └── server.js             # Entry point
├── public/                  # Frontend files
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   └── app.js           # Frontend JavaScript
│   ├── images/
│   │   └── favicon.ico      # Site favicon
│   └── index.html           # Main HTML page
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── plan.md                  # Implementation plan
└── README.md
```

### Adding New Features

1. **New endpoints**: Add routes in `src/routes/url.routes.js`
2. **Business logic**: Add controller functions in `src/controllers/url.controller.js`
3. **Validation**: Add validation rules in `src/middleware/validation.js`
4. **Database changes**: Update schema in `src/models/Url.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please open an issue on the repository.
