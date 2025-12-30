# Member Intelligence Platform - Backend API

Backend API for the Women in Web3 Switzerland Member Intelligence Platform built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Navigate to the backend directory:
```bash
cd member-intelligence-platform/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the MongoDB connection string and other variables as needed

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript (generated)
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server health check

### API Info
- `GET /api` - API information and version

### Coming Soon
- Authentication endpoints
- User management
- Profile management
- Introduction requests
- Job listings
- And more...

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time
- `FRONTEND_URL` - Frontend URL for CORS

## 🗄️ Database

The backend uses MongoDB with Mongoose ODM. The database connection is configured in [`src/config/database.ts`](src/config/database.ts).

### Connection Status
✅ Successfully connected to MongoDB Atlas
- Database: `member_intelligence_platform`
- Connection includes automatic reconnection handling
- Graceful shutdown on process termination

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Security**: Helmet, CORS
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Development**: nodemon, ts-node

## 📝 Development Notes

### TypeScript Configuration
- Strict mode enabled
- ES2020 target
- CommonJS modules
- Source maps enabled for debugging

### Security Features
- Helmet for security headers
- CORS configured for frontend origin
- Environment-based configuration
- Secure password hashing with bcryptjs

### Database Features
- Connection pooling (max 10 connections)
- Automatic reconnection
- Graceful shutdown handling
- Connection event logging

## 🚧 Next Steps

1. Implement authentication system (register, login, JWT)
2. Create user and profile models
3. Build introduction request system
4. Develop job listing functionality
5. Add recommendation engine
6. Implement email notifications
7. Add comprehensive error handling
8. Write unit and integration tests
9. Set up API documentation (Swagger/OpenAPI)
10. Configure production deployment

## 📄 License

ISC