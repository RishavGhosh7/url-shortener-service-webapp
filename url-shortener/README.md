# URL Shortener with React

A modern URL shortener application built with React, JavaScript, Node.js, Express, and MongoDB.

## Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Aliases**: Create custom short codes for your URLs
- **Expiration Dates**: Set expiration dates for your shortened URLs
- **Analytics**: View click statistics and analytics for your shortened URLs
- **Modern UI**: Beautiful, responsive interface built with React
- **JavaScript**: Clean, modern JavaScript with React hooks

## Tech Stack

### Frontend

- React 18 with JavaScript
- React Router for navigation
- Axios for API calls
- CSS3 with modern styling
- Font Awesome icons

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Express Validator for input validation
- CORS enabled for cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install React client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/urlshortener
   PORT=3000
   ```

   The React app will automatically use `http://localhost:3000/api` as the API URL.

### Running the Application

#### Development Mode (Recommended)

Run both the backend server and React development server simultaneously:

```bash
npm run dev-full
```

This will start:

- Backend server on `http://localhost:3000`
- React development server on `http://localhost:3001`

#### Production Mode

1. **Build the React app**

   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

#### Individual Commands

- **Backend only**: `npm run dev`
- **React client only**: `npm run client`
- **Build React app**: `npm run build`

## API Endpoints

- `POST /api/shorten` - Create a short URL
- `GET /:shortCode` - Redirect to original URL
- `GET /api/stats/:shortCode` - Get URL statistics

## Project Structure

```
url-shortener/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.tsx        # Main App component
│   │   └── App.css        # Styles
│   └── public/            # Static assets
├── src/                   # Backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Main server file
└── package.json           # Root package.json
```

## Usage

1. **Shorten a URL**: Enter a long URL in the form and optionally add a custom alias or expiration date
2. **View Results**: See your shortened URL with details like creation date and expiration
3. **Copy URL**: Click the copy button to copy the shortened URL to your clipboard
4. **View Analytics**: Click "View Analytics" to see click statistics and other metrics
5. **Navigate**: Use the navigation buttons to move between different sections

## Features in Detail

### URL Shortening

- Validates URLs before shortening
- Generates random short codes if no custom alias is provided
- Supports custom aliases (4-10 characters, alphanumeric with hyphens/underscores)
- Optional expiration dates

### Analytics

- Click count tracking
- Creation date display
- Last accessed timestamp
- Expiration status
- Real-time data refresh

### Responsive Design

- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface
- Modern gradient backgrounds and animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
