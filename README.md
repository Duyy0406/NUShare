# NUShare

**Name:** Tran Bao Duy  

---

## 📖 About NUShare

NUShare is a web forum application designed for NUS students to discuss modules, campus life, and more. It allows users to register, create topics (Admin only), post discussions, and comment on threads.

### ✨ Key Features

- 🔐 **User Authentication**: Register, Login (JWT), Logout
- 📋 **Topics**: View topics, Create topics (Admin Protected)
- 💬 **Posts**: Create, Read, Delete (Author protected)
- 💭 **Comments**: Add and view comments on posts
- 🎨 **Responsive UI**: Material UI design with posting dates

---

## 🏗️ Project Architecture

This project uses a separated frontend-backend architecture:

| Component | Technology |
|-----------|------------|
| **Frontend** | React, TypeScript, Material UI (Vite Template) |
| **Backend** | Go (Golang), Chi Router, GORM |
| **Database** | PostgreSQL |

---

## 🚀 Live Deployment

- **Frontend Application**: [https://eloquent-empanada-439f15.netlify.app](https://eloquent-empanada-439f15.netlify.app)
- **Backend API**: [https://nushare.onrender.com](https://nushare.onrender.com)

---

## 🛠️ Local Development Setup

To run this project locally for grading or testing, please follow these steps.

### Prerequisites

Ensure you have the following installed:

- **Go** (1.20+)
- **Node.js** (v18+) and npm
- **PostgreSQL**

### 1️⃣ Database Setup

Ensure PostgreSQL is running and create a database named `nushare`:

```bash
createdb nushare
```

### 2️⃣ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file with the following content:
   ```env
   PORT=8080
   DATABASE_URL=postgres://YOUR_USER:YOUR_PASSWORD@localhost:5432/nushare?sslmode=disable
   JWT_SECRET=secret_key_for_testing
   ```
   
   > **Note**: Replace `YOUR_USER` with your local postgres username (usually your system username on macOS)

3. Install dependencies and run the server:
   ```bash
   go mod tidy
   go run cmd/server/main.go
   ```

4. The server should start on `http://localhost:8080`

### 3️⃣ Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

---

## 🔐 Admin Access (For Testing)

To test Admin features (like "Create Topic"):

1. Register a new account on the website (e.g., username `admin_test`)
2. Access the Database manually (via `psql` or a GUI tool like pgAdmin)
3. Run the following SQL command:
   ```sql
   UPDATE users SET is_admin = true WHERE username = 'admin_test';
   ```
4. Re-login on the website. You will now see the **"New Topic"** button on the home page.

---

## 🤖 AI Usage Declaration

In accordance with the assignment guidelines, I declare the use of AI tools in the development of this project as follows:

### GitHub Copilot - Coding Assistant
- Debugging errors (e.g., TypeScript Grid syntax, CORS configuration)
- Suggesting improvements to codes

### Vite Template - Project Scaffolding
- The frontend structure was generated using the standard `npm create vite@latest` React+TypeScript template

### AI Image Generator - Asset Creation
- The favicon/logo used in the browser tab was generated using AI tools

### ChatGPT - Documentation & Learning
- Understanding complex concepts and best practices

---

## 📂 Project Structure

```
NUShare/
├── backend/
│   ├── cmd/server/          # Main application entry point
│   ├── internal/            # Internal packages
│   │   ├── handlers/        # HTTP request handlers
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Auth & CORS middleware
│   │   └── database/        # Database connection
│   ├── go.mod               # Go dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   └── App.tsx          # Main app component
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Vite configuration
│
└── README.md                # This file
```

---

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready`
- Check that the database exists: `psql -l | grep nushare`
- Verify DATABASE_URL in `.env` matches your PostgreSQL credentials

### CORS Errors
- Ensure the backend is running on port 8080
- Check that the frontend is making requests to `http://localhost:8080`

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Vite will automatically suggest an alternative port

---

## 📝 License

This project was created as part of the CVWO (Computing for Voluntary Welfare Organisations) Winter Assignment.

---

## 📧 Contact

For questions or issues regarding this submission, please contact:
- **Email**: e1375501@u.nus.edu
- **GitHub**: [@Duyy0406](https://github.com/Duyy0406)

---
