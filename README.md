# CityScope - Location-Based Community Platform

CityScope is a location-based community posting platform where users can share updates, recommendations, and local insights. Think of it as a mini-Twitter for neighborhoods or local groups, where users can interact through posts, replies, and reactions.

## Features

### User Authentication
- Sign up, log in, and log out
- JWT-based authentication

### Posts
- Create posts with text content (280 characters max)
- Choose post types:
  - Recommend a place
  - Ask for help
  - Share a local update
  - Event announcement
- Image upload support
- Location tagging

### Feed
- View posts in reverse chronological order
- Filter posts by type and location
- Post type badges for easy identification

### Interactions
- Reply to posts
- Like or dislike posts

### User Profiles
- View user information and bio
- See all posts by a specific user

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Hooks
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Cloudinary for image hosting

## Project Structure

```
cityscope-app/
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/        # Next.js app router pages
│   │   ├── components/ # React components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utility functions and API services
│   └── package.json    # Frontend dependencies
│
├── backend/            # Express backend application
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── .env            # Environment variables
│   ├── server.js       # Express server setup
│   └── package.json    # Backend dependencies
│
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account for image hosting (optional)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd cityscope-app
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables
   - Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd ../frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment

The application can be deployed using various platforms:

- Frontend: Vercel, Netlify, or AWS Amplify
- Backend: Heroku, AWS, or DigitalOcean

## License

This project is licensed under the MIT License.
