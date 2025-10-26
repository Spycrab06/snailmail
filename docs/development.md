# Development Guide

This guide helps you set up and develop SnailMail locally.

## Prerequisites

- Node.js 18+ and npm
- MySQL 8+ database
- Git

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/EdwardVNguyen/SnailMail.git
cd SnailMail
```

### 2. Install Dependencies

Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Database Setup

Create a MySQL database for development:

```sql
CREATE DATABASE snailmail_dev;
```

### 4. Environment Configuration

Create a `.env` file in the `/server` directory:

```bash
cd server
touch .env
```

Add the following configuration:

```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=snailmail_dev
DB_PORT=3306
NODE_ENV=development
```

## Running the Application

### Development Mode

You'll need two terminal windows:

#### Terminal 1: Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will start at: `http://localhost:3000`

Features:
- Hot Module Replacement (HMR)
- React Fast Refresh
- ESLint warnings in console

#### Terminal 2: Backend Development Server

```bash
cd server
npm run dev
```

The backend will start on port 8080 (or configured port).

Features:
- Auto-restart on file changes (via nodemon)
- Environment variables loaded from `.env`

## Project Structure

### Client Structure

```
client/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json
```

### Server Structure

```
server/
├── config/             # Database and app configuration
├── controllers/        # Route controllers
├── routers/           # API route definitions
├── utils/             # Utility functions
├── server.js          # Server entry point
└── package.json
```

## Development Workflow

### Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the appropriate directory:
   - Frontend changes in `/client`
   - Backend changes in `/server`

3. Test your changes locally

4. Commit with descriptive messages:
   ```bash
   git add .
   git commit -m "Add feature: description"
   ```

5. Push to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Quality

The project includes ESLint for code quality:

```bash
# Run linter on client code
cd client
npm run lint
```

### Building for Production

Test production builds locally:

```bash
# Build frontend
cd client
npm run build

# Preview production build
npm run preview
```

## API Development

### Adding New Routes

1. Create controller in `/server/controllers/`
2. Define routes in `/server/routers/`
3. Register router in `server.js`

Example:

```javascript
// server/controllers/exampleController.js
export const getExample = (req, res) => {
  res.json({ message: 'Example response' });
};

// server/routers/exampleRouter.js
import { Router } from 'express';
import { getExample } from '../controllers/exampleController.js';

const router = Router();
router.get('/example', getExample);

export default router;

// server/server.js
import exampleRouter from './routers/exampleRouter.js';
app.use('/api', exampleRouter);
```

## Frontend Development

### Adding New Components

1. Create component in `/client/src/components/`
2. Import and use in pages or other components

### Routing

The app uses React Router. Add routes in main routing configuration:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

## Database Migrations

When changing database schema:

1. Create migration SQL file
2. Run manually or use migration tool
3. Document changes in comments
4. Update models/controllers accordingly

## Troubleshooting

### Port Already in Use

If port 3000 is taken:
```bash
# Client - edit vite.config.js or use different port
npm run dev -- --port 3001
```

### Database Connection Failed

Check:
- MySQL service is running
- `.env` credentials are correct
- Database exists
- User has proper permissions

### Module Not Found

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Testing

Add tests in the future:

```bash
# Client tests (to be added)
cd client
npm test

# Server tests (to be added)
cd server
npm test
```

## Documentation

To run this documentation site locally:

```bash
# Install VitePress (if not already installed)
npm install -D vitepress

# Run docs dev server
npm run docs:dev
```

## Getting Help

- Check existing [GitHub Issues](https://github.com/EdwardVNguyen/SnailMail/issues)
- Create a new issue for bugs or feature requests
- Review code comments for implementation details
