# Virtual Recipe Book

A full-stack web application for creating, managing, and sharing recipes, featuring AI-powered recipe generation, image uploads, user authentication, and a modern dashboard interface.

## Features

- **AI Recipe Maker:** Generate recipes using AI based on ingredients or prompts.
- **Recipe Management:** Create, edit, delete, and view recipes.
- **Image Uploads:** Upload and manage recipe images with Cloudinary integration.
- **User Authentication:** Google OAuth and custom authentication.
- **Dashboard:** Personalized dashboard for users to manage their recipes.
- **Categories & Search:** Browse recipes by category and search functionality.

## Tech Stack

### Backend
- Node.js, Express.js
- MongoDB (via Mongoose)
- Cloudinary (image storage)
- JWT Authentication
- OpenAI API (for AI recipes)

### Frontend
- React (Vite)
- Context API for state management
- Axios for API requests
- Modern UI/UX with custom components

## Project Structure

```
Backend/
  controllers/      # API logic
  models/           # Mongoose models
  routes/           # Express routes
  middlewares/      # Auth, file upload, etc.
  config/           # Cloudinary, DB config
  DB/               # Database connection
  server.js         # Entry point
Frontend/
  src/
    components/     # React components
    context/        # Auth context
    lib/            # Axios, utils
    pages/          # App pages
    assets/         # Images, icons
  public/           # Static files
  index.html        # Main HTML
  vite.config.js    # Vite config
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account
- OpenAI API key (for AI features)

### Backend Setup
1. Navigate to the `Backend` folder:
   ```sh
   cd Backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the `Frontend` folder:
   ```sh
   cd Frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

### Usage
- Visit `http://localhost:5173` (or the port shown in your terminal) to access the app.
- Register or sign in with Google.
- Create, view, and manage your recipes.
- Use the AI Recipe Maker to generate new recipes.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
