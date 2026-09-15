# 🎓 Student Management System

A full-stack **Student Management System** built with **React, TypeScript, Express.js, MongoDB, and Tailwind CSS**.

The application provides a clean dashboard for managing students, teachers, courses, and users, with authentication and backend API integration.

## 🚀 Live Demo

🌐 **[View the Live Application](https://student-manager-system-fe.onrender.com/)**

> The application is deployed on Render.

---

## 📸 Overview

The Student Management System is designed to simplify common student-management tasks through a modern web interface.

### ✨ Main Features

* 🔐 User authentication
* 👨‍🎓 Student management
* 👨‍🏫 Teacher management
* 📚 Course management
* 👤 User management
* ➕ Add new students
* ✏️ Edit student information
* 🗑️ Delete students
* 🔎 View student information
* 🖼️ Student avatar support
* 📱 Responsive dashboard interface
* 🔄 Frontend–backend API integration
* 🗄️ MongoDB database
* ⚡ Fast development and production builds with Vite

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                  |
| ---------------- | ------------------------ |
| ⚛️ React         | User interface           |
| 📘 TypeScript    | Type safety              |
| ⚡ Vite           | Development & build tool |
| 🎨 Tailwind CSS  | Styling                  |
| 🧩 shadcn/ui     | UI components            |
| 🔄 Redux Toolkit | State management         |
| 🛣️ React Router | Client-side routing      |

### Backend

| Technology    | Purpose                    |
| ------------- | -------------------------- |
| 🟢 Node.js    | Runtime                    |
| 🚂 Express.js | REST API                   |
| 🍃 MongoDB    | Database                   |
| 🦫 Mongoose   | MongoDB object modeling    |
| 🔑 JWT        | Authentication             |
| 🌐 CORS       | Cross-origin communication |

---

## 🏗️ Project Architecture

The project follows a frontend/backend architecture:

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │   TypeScript + Vite  │
                    └──────────┬───────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │      REST API        │
                    └──────────┬───────────┘
                               │
                               │ Mongoose
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │       Database       │
                    └──────────────────────┘
```

---

## 📂 Project Structure

### Frontend

```text
React/
│
├── src/
│   ├── components/
│   │   ├── AddStudentForm.tsx
│   │   ├── StudentCard.tsx
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useStudents.ts
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── StudentsPage.tsx
│   │   ├── TeachersPage.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── Layout.tsx
│   │
│   ├── store/
│   │   ├── studentsSlice.ts
│   │   ├── studentsApi.ts
│   │   └── ...
│   │
│   └── ...
│
├── package.json
├── vite.config.ts
└── ...
```

### Backend

```text
Express/
│
├── src/
│   ├── config/
│   │   └── mongoose.ts
│   │
│   ├── controllers/
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── requestLogger.ts
│   │   └── errorHandler.ts
│   │
│   ├── models/
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── students.ts
│   │   ├── teachers.ts
│   │   └── ...
│   │
│   └── ...
│
├── package.json
└── ...
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### 2. Install frontend dependencies

```bash
cd React
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

The Vite development server will start locally.

### 4. Install backend dependencies

Open another terminal:

```bash
cd Express
npm install
```

### 5. Configure environment variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Do not commit your `.env` file or other sensitive credentials to GitHub.

### 6. Start the backend

```bash
npm run dev
```

---

## 🔑 Authentication

The application includes authentication functionality for users.

The authentication flow uses:

```text
User
 │
 ▼
Login / Signup
 │
 ▼
Express API
 │
 ▼
JWT Authentication
 │
 ▼
Protected Routes
 │
 ▼
Dashboard
```

---

## 👨‍🎓 Student Management

The student management section allows users to:

* Add students
* View students
* Edit student information
* Delete students
* View student details
* Assign courses
* Manage student avatars

Student data is stored in MongoDB and accessed through the Express REST API.

---

## 🔌 API Integration

The React frontend communicates with the Express backend through HTTP requests.

The frontend uses a dedicated API layer and authentication handling rather than directly coupling UI components to the backend.

```text
React Component
       │
       ▼
   useStudents
       │
       ▼
  studentsApi
       │
       ▼
    authFetch
       │
       ▼
 Express REST API
       │
       ▼
    MongoDB
```

This separation makes the application easier to maintain and extend.

---



## 🔮 Future Improvements

Some features that could be added in future versions:

* 📊 Advanced dashboard statistics
* 🔍 Advanced student search and filtering
* 📄 Student report generation
* 📧 Email notifications
* 📥 Export students to CSV/PDF
* 🖼️ Improved image upload and storage
* 👥 Role-based access control
* 📱 Further mobile UI improvements
* 📈 Attendance management
* 💰 Fee/payment management
