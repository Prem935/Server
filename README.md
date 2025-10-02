# Task Manager Backend

## Tech Stack
- Node.js, Express
- MongoDB, Mongoose
- JWT (jsonwebtoken), bcrypt
- Validation with express-validator
- CORS, Helmet

## Environment
Create `.env` with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intern_tasks
JWT_SECRET=replace_this_with_a_secure_secret
```

## Scripts
- `npm run dev`: start dev server
- `npm run build`: compile TypeScript
- `npm start`: run compiled app

## API
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile`
- PUT `/api/auth/profile`
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

## Scaling Notes
- Redis for session blacklisting and caching
- CDN for static assets
- MongoDB indexes on userId, status, priority, text search
- Rate limiting at gateway and per-route
- Microservices split: auth, tasks, gateway
- Load balancer with health checks
- Cache layer with Redis and HTTP caching headers
- Environment-based configs and secrets management
