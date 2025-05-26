# CityScope - Location-Based Community Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

CityScope is a location-based community posting platform where users can share updates, recommendations, and local insights. Think of it as a mini-Twitter for neighborhoods or local groups, where users can interact through posts, replies, and reactions.

## Demo

<div align="center">
  <a href="https://drive.google.com/file/d/1aXs-VHpM9TBP81luMqnjBAHxwYYtqA8O/view?usp=sharing">
    <img src="https://img.shields.io/badge/Watch_Demo-4285F4?style=for-the-badge&logo=google-drive&logoColor=white" alt="Watch Demo on Google Drive" />
  </a>
</div>

[Click here to download and view the demo video](https://drive.google.com/file/d/1aXs-VHpM9TBP81luMqnjBAHxwYYtqA8O/view?usp=sharing)

## Screenshots

<div align="center">
  <img src="https://github.com/Aman-Yadav-1/cityscope-app/raw/main/screenshots/home-feed.png" alt="Home Feed" width="400" />
  <img src="https://github.com/Aman-Yadav-1/cityscope-app/raw/main/screenshots/explore-map.png" alt="Explore Map" width="400" />
</div>

<div align="center">
  <img src="https://github.com/Aman-Yadav-1/cityscope-app/raw/main/screenshots/notifications.png" alt="Notifications" width="400" />
  <img src="https://github.com/Aman-Yadav-1/cityscope-app/raw/main/screenshots/post-detail.png" alt="Post Detail" width="400" />
</div>

## Overview

CityScope aims to connect local communities by providing a platform where users can:
- Share recommendations for local businesses and attractions
- Ask for help from neighbors
- Post updates about local events and news
- Discover what's happening in their vicinity through location-based filtering

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
- Bookmark posts for later reference
- Receive notifications for interactions with your content

### Explore
- View posts on an interactive map
- Discover content based on proximity to your location
- Toggle between map and list views

### User Profiles
- View user information and bio
- See all posts by a specific user

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- React Hooks and Context API for state management
- Axios for API requests
- Framer Motion for animations
- Google Maps API for location-based features

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

## Recent Updates

### Notification System
- Real-time notification counter in the header
- Mark notifications as read/unread
- Different notification types (likes, comments, follows)

### Google Maps Integration
- Interactive map view for exploring posts
- Location-based filtering
- User location detection

### Improved Error Handling
- Graceful fallbacks for API failures
- User-friendly error messages
- Consistent dialog-based feedback

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

Aman Yadav - [@Aman-Yadav-1](https://github.com/Aman-Yadav-1)

Project Link: [https://github.com/Aman-Yadav-1/cityscope-app](https://github.com/Aman-Yadav-1/cityscope-app)

## License

This project is licensed under the MIT License.
