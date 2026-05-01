# Team Task Manager

Team Task Manager is a full-stack web application for organizing projects, assigning tasks, and tracking team progress. It includes role-based access for admins and members, a responsive React frontend, and a Node.js/Express API backed by MongoDB.

## Live Demo

Frontend: https://ttm-frontend-rprb.onrender.com

## Features

- User signup and login with JWT authentication
- Admin and member role-based access
- Project creation, editing, deletion, and member management
- Task creation, assignment, status tracking, priority levels, and due dates
- Dashboard metrics for tasks, projects, progress, and deadlines
- Responsive UI built with React, TypeScript, and Tailwind CSS
- REST API with validation, security headers, CORS, and rate limiting

## Tech Stack

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- express-validator
- Helmet
- express-rate-limit

## Project Structure

```text
task-flow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16 or newer
- npm
- MongoDB database

### Backend Setup

```bash
cd backend
npm install
npm start
```

Create `backend/.env` with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Create `frontend/.env` with:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## API Overview

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Projects

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`

### Tasks

- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/my-tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Dashboard

- `GET /api/dashboard/stats`
- `GET /api/dashboard/trends`

## Deployment

The app is deployed on Render.

- Frontend live URL: https://ttm-frontend-rprb.onrender.com
- Backend requires environment variables for `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`, and any frontend origin/CORS settings used in production.

## Security Notes

- Keep `.env` files out of Git.
- Store production secrets in Render environment variables.
- Rotate any database password or JWT secret that is exposed publicly.

## License

This project is licensed under the MIT License.
