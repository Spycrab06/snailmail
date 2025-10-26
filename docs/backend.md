# Backend Architecture

The SnailMail backend is a Node.js server with MySQL database integration.

## Technology Stack

- **Node.js**: JavaScript runtime
- **MySQL2**: MySQL database driver
- **Express** (inferred): Web framework
- **Nodemon**: Development auto-reload

## Server Configuration

### Entry Point

Located at [server/server.js](../server/server.js)

The server runs with environment variables from `.env` file using Node's `--env-file` flag.

### Scripts

```bash
# Production
npm start          # node --env-file .env server.js

# Development
npm run dev        # nodemon --env-file .env server.js
```

## Project Structure

```
server/
├── config/           # Database and configuration
├── controllers/      # Business logic and request handlers
├── routers/         # API route definitions
├── utils/           # Helper functions and utilities
├── server.js        # Server entry point
└── .env             # Environment variables (not in git)
```

## Database Connection

### MySQL2 Configuration

The server uses `mysql2` for database connections:

```javascript
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default pool
```

### Connection Pooling

Benefits:
- Reuses database connections
- Improves performance
- Handles concurrent requests efficiently

## Environment Variables

Create `.env` file in `/server` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=snailmail_dev
DB_PORT=3306

# Server Configuration
PORT=8080
NODE_ENV=development

# Optional: API Keys, JWT Secret, etc.
```

**Important**: Never commit `.env` files to version control!

## API Routes

### Route Structure

Routes are organized by feature/resource:

```
routers/
├── userRouter.js
├── messageRouter.js
└── ...
```

Example router:

```javascript
import { Router } from 'express'
import { getMessages, createMessage } from '../controllers/messageController.js'

const router = Router()

router.get('/messages', getMessages)
router.post('/messages', createMessage)

export default router
```

### Controllers

Controllers handle business logic:

```javascript
// controllers/messageController.js
import pool from '../config/database.js'

export const getMessages = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages')
    res.json(rows)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createMessage = async (req, res) => {
  try {
    const { content, sender } = req.body
    const [result] = await pool.query(
      'INSERT INTO messages (content, sender) VALUES (?, ?)',
      [content, sender]
    )
    res.status(201).json({ id: result.insertId })
  } catch (error) {
    console.error('Error creating message:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

## Middleware

Common middleware to consider adding:

```javascript
import express from 'express'
import cors from 'cors'

const app = express()

// Parse JSON bodies
app.use(express.json())

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})
```

## Error Handling

### Error Middleware

```javascript
// Error handling middleware (add at end of middleware chain)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
})
```

### Try-Catch Pattern

Always wrap async operations:

```javascript
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Usage
router.get('/data', asyncHandler(async (req, res) => {
  const data = await fetchData()
  res.json(data)
}))
```

## Database Queries

### Parameterized Queries

Always use parameterized queries to prevent SQL injection:

```javascript
// ✅ Good - parameterized
const [rows] = await pool.query(
  'SELECT * FROM users WHERE id = ?',
  [userId]
)

// ❌ Bad - SQL injection risk
const [rows] = await pool.query(
  `SELECT * FROM users WHERE id = ${userId}`
)
```

### Transactions

For operations that need atomicity:

```javascript
const connection = await pool.getConnection()
try {
  await connection.beginTransaction()

  await connection.query('INSERT INTO table1 VALUES (?)', [value1])
  await connection.query('INSERT INTO table2 VALUES (?)', [value2])

  await connection.commit()
} catch (error) {
  await connection.rollback()
  throw error
} finally {
  connection.release()
}
```

## Utilities

Common utilities to add in `/server/utils/`:

```javascript
// utils/validators.js
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// utils/db.js
export const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit
  return { limit, offset }
}
```

## Security Best Practices

1. **Environment Variables**: Never hardcode secrets
2. **SQL Injection**: Use parameterized queries
3. **CORS**: Configure allowed origins
4. **Rate Limiting**: Prevent abuse
5. **Input Validation**: Validate all user input
6. **Authentication**: Add JWT or session-based auth
7. **HTTPS**: Use in production
8. **Helmet**: Add security headers

## Deployment to Vercel

For Vercel serverless deployment, the backend structure may need adaptation:

1. Create `/api` directory in project root
2. Each file becomes a serverless function
3. Functions are stateless
4. Database connections per request

See [Deployment Guide](./deployment.md) for details.

## Monitoring and Logging

Consider adding:

- **Morgan**: HTTP request logger
- **Winston**: Application logger
- **Sentry**: Error tracking
- **New Relic**: Performance monitoring

Example:

```javascript
import morgan from 'morgan'

app.use(morgan('combined'))
```

## Performance Optimization

1. **Database Indexing**: Index frequently queried columns
2. **Query Optimization**: Avoid N+1 queries
3. **Caching**: Add Redis for frequently accessed data
4. **Connection Pooling**: Already implemented with mysql2
5. **Compression**: Compress responses

```javascript
import compression from 'compression'
app.use(compression())
```

## Testing

Add tests for API endpoints:

```javascript
// tests/message.test.js
import request from 'supertest'
import app from '../server.js'

describe('Message API', () => {
  test('GET /api/messages returns messages', async () => {
    const response = await request(app)
      .get('/api/messages')
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
  })
})
```
