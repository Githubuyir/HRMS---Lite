# HRMS Lite

HRMS Lite is a lightweight Human Resource Management System built as a full-stack web application.  
It allows organizations to manage employees and track attendance efficiently through a clean and intuitive interface.

This project was developed as part of a full-stack assessment to demonstrate frontend development, backend API design, database modeling, validations, and deployment readiness.

---

## 🚀 Live Demo

- **Frontend (Web App):**  
  https://your-frontend-url.vercel.app

- **Backend API:**  
  https://your-backend-url.onrender.com

> Note: The frontend is fully connected to the live backend API.  
> Users only need the frontend link to use the application.

---

## 🧩 Features

### Employee Management
- Add new employees
- View employee list
- Persistent storage using MongoDB

### Attendance Management
- Mark attendance for employees
- Select date and attendance status (Present / Absent)
- View attendance records
- Filter attendance by employee, date, and status
- Prevent saving attendance with missing inputs (validation)

### Dashboard
- Overview of total employees
- Attendance summary
- Clean, minimal UI for quick insights

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- CSS (custom styling)
- Axios for API communication

### Backend
- Node.js
- Express.js
- RESTful API architecture

### Database
- MongoDB Atlas
- Mongoose (ODM)

### Deployment
- Frontend: **Vercel**
- Backend: **Render**
- Database: **MongoDB Atlas**

---


## 📁 Project Structure

HRMS/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── App.jsx
│ └── package.json
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── server.js
│ └── package.json
│
└── README.md


---

## 🔐 Validations & Error Handling

- Frontend validation to prevent empty form submissions
- Backend schema validation using Mongoose
- Proper HTTP status codes for API responses
- User-friendly alerts for success and error states

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api

Backend (backend/.env)
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string


Running the Project Locally

Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

Deployment Strategy

The frontend is deployed as a static React SPA on Vercel.

The backend is deployed as a Node.js web service on Render.

The frontend communicates with the backend using REST APIs.

MongoDB Atlas is used for cloud database persistence.


Future Improvements

Authentication and role-based access (Admin / HR / Employee)

Edit & delete employee functionality

Attendance reports and exports

Improved UI notifications (toasts)

Pagination and search


Author
Steven Abraham


Notes for Evaluators

The application starts with a clean database (no dummy data).

All data added through the UI is persisted in MongoDB.

Browser alerts are intentionally used for lightweight validation and confirmation without external UI libraries.

---




