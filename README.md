# 💰 Expense Tracker

A full-stack expense tracking application — a **Spring Boot 4** REST API backed by **MongoDB Atlas**, paired with a **React** frontend for registering, logging in, and visualizing personal expenses.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Data Models](#data-models)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

**Expense Tracker** is a full-stack application for managing personal expenses. The backend is a Spring Boot 4 REST API using JWT-based stateless authentication and MongoDB Atlas for storage. The frontend is a React single-page app with protected routing, a login/register flow, and a dashboard that visualizes spending by category using Chart.js.

---

## Features

**Backend**
- 🔐 **JWT Authentication** — stateless login/register flow with signed tokens (HS256)
- 💵 **Expense Management** — create and retrieve expenses scoped to a specific user
- 🗄️ **MongoDB Atlas Integration** — cloud-hosted document storage
- 🛡️ **Spring Security** — stateless session management with a custom JWT filter chain
- ⚙️ **Spring Boot 4.1** — built on the latest modularized starter architecture

**Frontend**
- 🔑 **Auth Pages** — login and registration forms wired to the backend's `/auth` endpoints
- 📊 **Expense Dashboard** — add expenses and view a category breakdown via a doughnut chart
- 🛣️ **Protected Routing** — `react-router-dom` route guard redirects unauthenticated users to `/login`
- 🔒 **Session Persistence** — JWT stored in `localStorage`, auto-attached to every API request via an Axios interceptor
- 🚪 **Auto Logout** — expired/invalid tokens (401/403) automatically clear the session
- 🎞️ **Animated UI** — Framer Motion transitions, styled with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | |
| Language | Java 17 |
| Framework | Spring Boot 4.1.0 |
| Web | Spring Boot Starter WebMVC |
| Security | Spring Security |
| Database | MongoDB Atlas (Spring Data MongoDB) |
| Auth | JJWT (JSON Web Token) 0.11.5 |
| Build Tool | Maven |
| **Frontend** | |
| Library | React 18 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Charts | Chart.js + react-chartjs-2 |
| Animation | Framer Motion |
| Auth Utility | jwt-decode |
| Build Tool | Create React App (react-scripts) |

---

## Project Structure

```
expense-tracker/
├── backend/
│   └── expense-tracker/
│       ├── src/main/java/com/marwan/
│       │   ├── controller/
│       │   │   ├── AuthController.java        # Register & login endpoints
│       │   │   └── ExpenseController.java     # Expense CRUD endpoints
│       │   ├── model/
│       │   │   ├── User.java
│       │   │   └── Expense.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   └── ExpenseRepository.java
│       │   ├── service/
│       │   │   ├── UserService.java
│       │   │   └── ExpenseService.java
│       │   ├── security/
│       │   │   ├── SecurityConfig.java
│       │   │   ├── JwtFilter.java
│       │   │   └── JwtUtil.java
│       │   └── ExpenseTrackerApplication.java # Main entry point + MongoClient bean
│       ├── src/main/resources/
│       │   └── application.properties
│       └── pom.xml
└── frontend/
    └── expense-tracker-frontend/
        └── expense-tracker-frontend/
            ├── src/
            │   ├── api/
            │   │   └── api.js               # Axios instance + backend calls
            │   ├── context/
            │   │   └── AuthContext.js       # Auth state, login/register/logout
            │   ├── routes/
            │   │   └── AppRoutes.js         # Route definitions + protected route
            │   ├── pages/
            │   │   ├── Login.js
            │   │   ├── Register.js
            │   │   └── Dashboard.js
            │   ├── components/
            │   │   ├── Navbar.js
            │   │   ├── ExpenseForm.js
            │   │   └── ExpenseList.js
            │   ├── styles/
            │   │   ├── auth.css
            │   │   └── dashboard.css
            │   ├── App.js
            │   └── index.js
            ├── tailwind.config.js
            ├── .env.example
            └── package.json
```

---

## Prerequisites

- **Java 17** or later
- **Maven** (or use the included `mvnw` wrapper)
- **Node.js** (v18+) and **npm**
- A **MongoDB Atlas** cluster (or any MongoDB URI you have access to)

---

## Getting Started

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/marwanramiz/expense-tracker.git
   cd expense-tracker/backend/expense-tracker
   ```

2. **Configure your environment**

   Update `src/main/resources/application.properties` with your own MongoDB URI and JWT secret (see [Configuration](#configuration) below).

3. **Build and run**
   ```bash
   ./mvnw clean package -DskipTests
   ./mvnw spring-boot:run
   ```

   The API starts on `http://localhost:8080`.

### Frontend Setup

1. **Navigate to the frontend folder**
   ```bash
   cd expense-tracker/frontend/expense-tracker-frontend/expense-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the API base URL**

   Copy `.env.example` to `.env` and adjust if your backend isn't running on `localhost:8080`:
   ```bash
   cp .env.example .env
   ```
   ```
   REACT_APP_API_BASE_URL=http://localhost:8080
   ```

4. **Run the frontend**
   ```bash
   npm start
   ```

   The app opens at `http://localhost:3000` and expects the backend to be running at the URL set above.

---

## Configuration

### Backend — `application.properties`

```properties
spring.application.name=expense-tracker
spring.data.mongodb.uri=<your-mongodb-atlas-uri>
spring.data.mongodb.database=expense_tracker
jwt.secret=<your-jwt-secret-key>
server.port=8080
```

| Property | Description |
|---|---|
| `spring.data.mongodb.uri` | Full MongoDB Atlas connection string (`mongodb+srv://...`) |
| `spring.data.mongodb.database` | Target database name |
| `jwt.secret` | Secret key used to sign JWTs (must be ≥ 32 characters for HS256) |
| `server.port` | Port the application runs on |

> **⚠️ Security recommendation:** Do not commit real credentials to version control. Move these values into environment variables or a `.env`/secrets manager, and add `application.properties` to `.gitignore` before pushing. If credentials have already been committed, rotate them in MongoDB Atlas immediately — the current `application.properties` in this repo still contains a live connection string and should be rotated.

### Frontend — `.env`

| Variable | Description |
|---|---|
| `REACT_APP_API_BASE_URL` | Base URL of the backend API (defaults to `http://localhost:8080`) |

### Why `MongoClient` is created explicitly (backend)

`ExpenseTrackerApplication.java` defines the `MongoClient` bean manually from the `spring.data.mongodb.uri` property:

```java
@Bean
public MongoClient mongoClient() {
    return MongoClients.create(mongoUri);
}
```

This works around a Spring Boot 4.1 behavior where the auto-configured `MongoConnectionDetails` bean can fall back to `localhost:27017` instead of the configured Atlas URI. Building the client explicitly guarantees the Atlas connection string is always used.

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Log in and receive a JWT | No |

**Register**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "marwan",
  "password": "yourpassword"
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "marwan",
  "password": "yourpassword"
}
```
Returns a signed JWT string on success (the frontend normalizes this into a plain token via `loginUser()` in `api.js`).

### Expenses

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/expenses` | Add a new expense | Yes |
| `GET` | `/api/expenses/{userId}` | Get all expenses for a user | Yes |

**Add Expense**
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "abc123",
  "amount": 49.99,
  "category": "Groceries",
  "date": "2026-07-21",
  "description": "Weekly shopping"
}
```

**Get Expenses by User**
```http
GET /api/expenses/{userId}
Authorization: Bearer <token>
```

> All routes except `/auth/register` and `/auth/login` require a valid JWT in the `Authorization: Bearer <token>` header. The frontend attaches this automatically via an Axios request interceptor.

---

## Authentication Flow

1. User registers via the **Register** page → `POST /auth/register`.
2. User logs in via the **Login** page → `POST /auth/login` and receives a signed JWT.
3. The frontend decodes the JWT's `sub` claim to resolve a `userId`, then stores the token, `userId`, and `username` in `localStorage`.
4. Every subsequent API call attaches `Authorization: Bearer <token>` automatically via the Axios interceptor in `api.js`.
5. `JwtFilter` on the backend validates the token per-request; sessions are stateless (`SessionCreationPolicy.STATELESS`).
6. If a request returns `401`/`403` (expired/invalid token), the frontend clears local storage and the protected route redirects back to `/login`.

---

## Data Models

**User**
```java
{
  id: String,
  username: String,
  password: String
}
```

**Expense**
```java
{
  id: String,
  userId: String,
  amount: Double,
  category: String,
  date: LocalDate,
  description: String
}
```

---

## Security Notes

- Passwords are currently stored and compared as plain text on the backend — **this should be replaced with hashed passwords (e.g. BCrypt) before any real-world use.**
- CSRF protection is disabled on the backend, which is standard for stateless JWT APIs but should be paired with proper CORS configuration in production.
- `jwt.secret` must be at least 32 bytes long for HS256 signing to succeed.
- The JWT is stored in `localStorage` on the frontend, which is convenient but vulnerable to XSS-based token theft — consider an `httpOnly` cookie-based approach for production use.
- `application.properties` currently contains a live MongoDB Atlas connection string committed to the repo — **rotate this credential and move it to an environment variable.**

---

## Roadmap

- [ ] Hash passwords with BCrypt
- [ ] Add expense update/delete endpoints (backend) and corresponding UI actions (frontend)
- [ ] Add pagination and filtering (by date range, category)
- [ ] Add input validation with `spring-boot-starter-validation`
- [ ] Add unit and integration tests (backend and frontend)
- [ ] Externalize secrets via environment variables
- [ ] Move JWT storage to an `httpOnly` cookie
- [ ] Add monthly/weekly spending trend charts

---

## Author

**Marwan Ramiz**
[GitHub](https://github.com/marwanramiz) · [LinkedIn](https://linkedin.com/in/marwan-ramiz-m-8584a9326)
