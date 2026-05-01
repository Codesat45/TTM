# Team Task Manager

A production-ready, full-stack team task management application built with React.js, Node.js, and MongoDB.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with secure password hashing
- Role-based access control (Admin/Member)
- Protected routes and middleware
- Session management with localStorage

### Project Management
- Create, read, update, and delete projects
- Add/remove team members to projects
- Project status tracking (Active, Completed, On Hold)
- Project member management

### Task Management
- Full CRUD operations for tasks
- Task assignment to team members
- Status tracking (Todo, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Due date management with overdue detection
- Advanced filtering and search

### Dashboard & Analytics
- Real-time statistics and metrics
- Task status and priority distribution
- Project completion rates
- Recent tasks and upcoming deadlines
- Time-based filtering (Today, Week, Month)

### UI/UX Features
- Modern, responsive design with Tailwind CSS
- Professional card-based layouts
- Loading states and empty states
- Error handling with toast notifications
- Mobile-friendly interface
- Clean navigation with sidebar

## 🛠 Tech Stack

### Frontend
- **React.js 18** - UI library with functional components and hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Modern utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Beautiful toast notifications
- **Heroicons** - Professional SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object data modeling (ODM)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-flow
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For MongoDB installed locally
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 6. Start the Application

```bash
# Start backend (in backend directory)
npm run dev

# Start frontend (in frontend directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
task-flow/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   ├── server.js           # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── public/
│   └── package.json
└── README.md
```

## 🔐 Authentication & Roles

### Admin Role
- Create and delete projects
- Add/remove team members
- Assign tasks to any team member
- View all projects and tasks
- Full system access

### Member Role
- View assigned projects
- Update only their assigned tasks
- View tasks they're assigned to
- Limited system access

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/my-tasks` - Get my tasks
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/trends` - Get task trends

## 🎨 UI Components

### Reusable Components
- **Navbar** - Navigation header with user info
- **Sidebar** - Navigation menu with role-based items
- **LoadingSpinner** - Loading state indicator
- **Card** - Consistent card layout
- **Badge** - Status and priority indicators
- **Modal** - Dialog components
- **Form** - Input components with validation

### Pages
- **Login/Signup** - Authentication pages
- **Dashboard** - Statistics and overview
- **Projects** - Project management
- **Tasks** - Task management with filtering

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production mode
cd backend
npm start
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🛡 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Security headers with Helmet
- Role-based access control
- Protected routes and middleware

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Admin/Member),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  name: String,
  description: String,
  createdBy: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  status: String (Active/Completed/On Hold),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  projectId: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  status: String (Todo/In Progress/Completed),
  priority: String (Low/Medium/High),
  dueDate: Date,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Build and start the server
3. Configure MongoDB connection
4. Set up reverse proxy (nginx)

### Frontend Deployment
1. Build the React app
2. Serve static files
3. Configure routing
4. Set up CDN if needed

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify network connectivity

2. **JWT Token Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in .env
   - Verify token expiration

3. **CORS Errors**
   - Check frontend API URL
   - Verify CORS configuration
   - Ensure proper port usage

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Getting Help

- Check the console for error messages
- Review the API response in browser dev tools
- Verify environment variables are set correctly
- Ensure MongoDB is accessible and running

## 🔄 Updates & Maintenance

Regular updates and maintenance are recommended for:
- Security patches
- Dependency updates
- Performance improvements
- New feature additions

---

Built with ❤️ using modern web technologies
#   t a s k - f l o w  
 