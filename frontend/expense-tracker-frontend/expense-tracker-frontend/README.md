# Ledger — Expense Tracker Frontend

A React frontend for the [expense-tracker](https://github.com/marwanramiz/expense-tracker) Spring Boot backend (JWT auth + MongoDB).

## Stack

- React 18 + React Router 6
- Tailwind CSS (custom "ledger" design system)
- Framer Motion (page/scroll animations)
- Chart.js + react-chartjs-2 (category breakdown)
- Axios (API calls, with JWT auto-attached to requests)

## Getting started

```bash
npm install
npm start
```

The app runs at `http://localhost:3000` and expects the backend at
`http://localhost:8080` (matching the backend's `server.port=8080`).
To point at a different backend URL, copy `.env.example` to `.env` and
set `REACT_APP_API_BASE_URL`.

Make sure the Spring Boot backend is running (`./mvnw spring-boot:run`
from the backend repo) and that CORS is enabled for `http://localhost:3000`
if you're calling it cross-origin, since the backend's Security config
disables CSRF but doesn't automatically allow browser cross-origin requests.

## ⚠️ Important assumption about `userId`

The backend's `POST /auth/login` returns **only a signed JWT string** —
it doesn't return the user's Mongo `_id`. But `GET /api/expenses/{userId}`
needs that id. To bridge this gap, the frontend decodes the JWT after
login and uses its `sub` claim as the `userId` for all expense requests
(see `src/context/AuthContext.js`).

This works out of the box **only if** your `JwtUtil.generateToken(...)`
signs the token with the user's Mongo `_id` as the subject. If it instead
uses the `username` as the subject (which is common), you have two options:

1. Change `JwtUtil` to sign the Mongo `_id` as the subject instead of the
   username, or
2. Have `/auth/register` and `/auth/login` return the user's `id` in the
   response body, and update `AuthContext.js` to store that value instead
   of decoding it from the token.

Everything else (register, login, add expense, list expenses, JWT header)
matches the API reference in the backend's README exactly.

## Project structure

```
src/
├── api/api.js              # Axios instance + auth/expense calls
├── context/AuthContext.js  # Login/register/logout + session state
├── routes/AppRoutes.js     # Route definitions + protected route
├── components/
│   ├── Navbar.js
│   ├── ExpenseForm.js
│   └── ExpenseList.js
├── pages/
│   ├── Login.js
│   ├── Register.js
│   └── Dashboard.js
├── styles/
│   ├── auth.css
│   └── dashboard.css
├── App.js
└── index.js
```
