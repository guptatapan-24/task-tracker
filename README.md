# 📋 TaskTracker — MERN Task Management App

A modern, full-stack task management application built with the **MERN** stack (MongoDB, Express, React, Node.js). Features a premium dark-themed UI with glassmorphism design, full CRUD operations, filtering, search, and sorting.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Express-5-green) ![Tech Stack](https://img.shields.io/badge/MongoDB-Mongoose-darkgreen) ![Tech Stack](https://img.shields.io/badge/Vite-latest-purple)

---

## ✨ Features

- **Full CRUD** — Create, read, update, and delete tasks
- **Filtering** — Filter by status (To Do / In Progress / Done) and priority (Low / Medium / High)
- **Search** — Debounced real-time search by task title
- **Sorting** — Sort by due date, priority, or creation date
- **Validation** — Duplicated on both client and server (Joi + React form validation)
- **Toast Notifications** — Success/error feedback for all operations
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Premium Dark Theme** — Glassmorphism cards, gradient accents, micro-animations

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Axios, CSS3        |
| Backend    | Node.js, Express 5, Joi            |
| Database   | MongoDB, Mongoose                   |
| Security   | Helmet, CORS                        |
| Dev Tools  | Nodemon, Vite HMR                   |

---

## 📁 Project Structure

```
task-tracker/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI primitives (Button, Input, Badge, Modal, Spinner)
│   │   │   ├── TaskForm.jsx    # Create/edit form with validation
│   │   │   ├── TaskCard.jsx    # Individual task card
│   │   │   ├── TaskList.jsx    # Task grid with empty state
│   │   │   └── FilterBar.jsx   # Filter, search, sort controls
│   │   ├── context/
│   │   │   └── ToastContext.jsx # Toast notification system
│   │   ├── services/
│   │   │   └── api.js          # Axios API service layer
│   │   ├── App.jsx             # Main application component
│   │   ├── App.css
│   │   ├── index.css           # Global design system
│   │   └── main.jsx            # Entry point
│   ├── .env.example
│   └── package.json
├── server/                     # Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   └── taskController.js   # CRUD route handlers
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized error handling
│   │   └── validate.js         # Joi validation schemas
│   ├── models/
│   │   └── Task.js             # Mongoose Task schema
│   ├── routes/
│   │   └── taskRoutes.js       # API route definitions
│   ├── .env.example
│   ├── index.js                # Server entry point
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster)
- **Git**

### 1. Clone the Repository

```bash
git clone <repo-url>
cd task-tracker
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env   # then edit .env with your values
npm install
npm run dev             # starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd client
cp .env.example .env   # then edit .env with your values
npm install
npm run dev             # starts on http://localhost:5173
```

### 4. Verify

- Backend health: http://localhost:5000/api/health
- Frontend: http://localhost:5173

---

## ⚙️ Environment Variables

### Server (`server/.env`)

| Variable       | Description                              | Default                                  |
|----------------|------------------------------------------|------------------------------------------|
| `PORT`         | Server port                              | `5000`                                   |
| `MONGODB_URI`  | MongoDB connection string                | `mongodb://localhost:27017/task-tracker`  |
| `CLIENT_ORIGIN`| Frontend URL for CORS                    | `http://localhost:5173`                   |
| `NODE_ENV`     | Environment mode                         | `development`                            |

### Client (`client/.env`)

| Variable       | Description                              | Default                                  |
|----------------|------------------------------------------|------------------------------------------|
| `VITE_API_URL` | Backend API base URL (no trailing slash) | `http://localhost:5000/api`              |

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Health Check

```
GET /api/health
```

Response: `200 OK`
```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

### Tasks

#### List All Tasks

```
GET /api/tasks
```

Query Parameters:
| Param      | Type   | Description                                  |
|------------|--------|----------------------------------------------|
| `status`   | string | Filter: `todo`, `in-progress`, `done`        |
| `priority` | string | Filter: `low`, `medium`, `high`              |
| `search`   | string | Case-insensitive title search                |
| `sort`     | string | `dueDate`, `-dueDate`, `priority`, `-priority`, `createdAt`, `-createdAt` |

Response: `200 OK`
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "title": "Build API",
      "description": "Create REST endpoints",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2024-02-01T00:00:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Task

```
GET /api/tasks/:id
```

Response: `200 OK` or `404 Not Found`

#### Create Task

```
POST /api/tasks
Content-Type: application/json
```

Request Body:
```json
{
  "title": "My Task",              // required, max 100 chars
  "description": "Details here",   // optional, max 500 chars
  "status": "todo",                // optional: todo | in-progress | done
  "priority": "medium",            // optional: low | medium | high
  "dueDate": "2024-02-01"          // optional: ISO date
}
```

Response: `201 Created`

Validation Error: `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
```

#### Update Task

```
PUT /api/tasks/:id
Content-Type: application/json
```

Request Body: Same fields as create (all optional, at least one required)

Response: `200 OK`, `400 Bad Request`, or `404 Not Found`

#### Delete Task

```
DELETE /api/tasks/:id
```

Response: `200 OK` or `404 Not Found`
```json
{
  "success": true,
  "message": "Task deleted",
  "data": { /* deleted task */ }
}
```

---

## 🚢 Deployment

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables: `MONGODB_URI`, `CLIENT_ORIGIN`, `NODE_ENV=production`

### Frontend → Vercel

1. Import project on [Vercel](https://vercel.com)
2. Settings:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### MongoDB → Atlas

1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Add your server's IP to the network access list (or allow all IPs `0.0.0.0/0`)
3. Copy the connection string and set it as `MONGODB_URI`

---

## 🔗 Live Deployment

| Service  | URL                                      |
|----------|------------------------------------------|
| Frontend | _Deploy and update this URL_             |
| Backend  | _Deploy and update this URL_             |

---

## 📝 License

MIT
