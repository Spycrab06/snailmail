# SnailMail

Welcome to SnailMail documentation!

## What is SnailMail?

SnailMail is a full-stack application built with React (frontend) and Node.js (backend), designed for efficient message handling and delivery.

## Project Structure

The project consists of two main parts:

- **Client**: React application built with Vite
- **Server**: Node.js/Express backend with MySQL database

## Quick Start

### Development

```bash
# Install dependencies for both client and server
cd client && npm install
cd ../server && npm install

# Run development servers
# Terminal 1 - Frontend (runs on port 3000)
cd client && npm run dev

# Terminal 2 - Backend
cd server && npm run dev
```

### Production Build

```bash
# Build frontend
cd client && npm run build

# Start backend
cd server && npm start
```

## Features

- Modern React UI with React Router
- RESTful API backend
- MySQL database integration
- Automated deployment on Vercel

## Next Steps

- [Development Guide](./development.md) - Learn how to develop locally
- [Deployment Guide](./deployment.md) - Deploy to Vercel
- [Frontend Architecture](./frontend.md) - Understand the client structure
- [Backend Architecture](./backend.md) - Understand the server structure
