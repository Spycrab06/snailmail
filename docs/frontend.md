# Frontend Architecture

The SnailMail frontend is a modern React application built with Vite.

## Technology Stack

- **React 19.1**: UI library with latest features
- **React Router 7.9**: Client-side routing
- **Vite 7.1**: Build tool and development server
- **ESLint**: Code quality and consistency

## Build Configuration

### Vite Configuration

Located at [client/vite.config.js](../client/vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

### Build Commands

```bash
# Development server with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
client/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page-level components
│   ├── assets/           # Static assets (images, fonts)
│   ├── styles/           # CSS/styling files
│   ├── App.jsx           # Root component
│   └── main.jsx          # Application entry point
├── public/               # Public static files
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── package.json
```

## Key Features

### Hot Module Replacement (HMR)

Vite provides instant updates during development without full page reload.

### React Fast Refresh

Preserves component state while editing, making development faster.

### Code Splitting

Vite automatically splits code for optimal loading performance.

### Asset Optimization

- Image optimization
- CSS minification
- JavaScript bundling and minification

## Environment Variables

Create `.env` files in the client directory:

```env
# .env.development
VITE_API_URL=http://localhost:8080/api

# .env.production
VITE_API_URL=https://your-api.vercel.app/api
```

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Routing

React Router handles client-side navigation:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## State Management

Currently using React's built-in state management:
- `useState` for local state
- `useContext` for shared state (if needed)
- Consider adding Redux or Zustand for complex state

## API Integration

Making API calls to the backend:

```javascript
// Example API call
const fetchData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/endpoint`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

## Styling

Options for styling components:
- CSS Modules
- Styled Components (can be added)
- Tailwind CSS (can be added)
- Plain CSS

## Performance Optimization

### Lazy Loading

```javascript
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./components/Heavy'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

### Memoization

```javascript
import { memo, useMemo, useCallback } from 'react'

const ExpensiveComponent = memo(({ data }) => {
  const processed = useMemo(() => {
    return heavyCalculation(data)
  }, [data])

  return <div>{processed}</div>
})
```

## Build Output

Production build creates optimized files in `/client/dist`:

```
dist/
├── assets/
│   ├── index-[hash].js    # Bundled JavaScript
│   └── index-[hash].css   # Bundled CSS
├── index.html             # Entry HTML
└── ...
```

## Deployment

The frontend is deployed as a static site on Vercel:

1. Vite builds static files
2. Files are uploaded to Vercel CDN
3. Served globally with edge caching

See [Deployment Guide](./deployment.md) for details.
