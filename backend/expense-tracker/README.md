# 💰 Expense Tracker API

A secure, RESTful backend for tracking personal expenses, built with **Spring Boot 4** and **MongoDB Atlas**. Features JWT-based authentication and per-user expense management.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Data Models](#data-models)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

**Expense Tracker API** is a Spring Boot 4 backend that lets users register, log in, and manage their personal expenses. Authentication is handled via stateless JWT tokens, and all data is persisted in MongoDB Atlas.

This project was built as a hands-on exercise in modern Spring Boot (4.x) development, including its modularized starter dependencies and updated MongoDB auto-configuration behavior.

---

## Features

- 🔐 **JWT Authentication** — stateless login/register flow with signed tokens (HS256)
- 💵 **Expense Management** — create and retrieve expenses scoped to a specific user
- 🗄️ **MongoDB Atlas Integration** — cloud-hosted document storage
- 🛡️ **Spring Security** — stateless session management with a custom JWT filter chain
- ⚙️ **Spring Boot 4.1** — built on the latest modularized starter architecture

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 4.1.0 |
| Web | Spring Boot Starter WebMVC |
| Security | Spring Security |
| Database | MongoDB Atlas (Spring Data MongoDB) |
| Auth | JJWT (JSON Web Token) 0.11.5 |
| Build Tool | Maven |
| Dev Tools | Spring Boot DevTools |

---

## Project Structure

```
expense-tracker/
├── src/main/java/com/marwan/
│   ├── controller/
│   │   ├── AuthController.java        # Register & login endpoints
│   │   └── ExpenseController.java     # Expense CRUD endpoints
│   ├── model/
│   │   ├── User.java                  # User document schema
│   │   └── Expense.java               # Expense document schema
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── ExpenseRepository.java
│   ├── service/
│   │   ├── UserService.java
│   │   └── ExpenseService.java
│   ├── security/
│   │   ├── SecurityConfig.java        # Security filter chain config
│   │   ├── JwtFilter.java             # JWT request filter
│   │   └── JwtUtil.java               # Token generation/validation
│   └── ExpenseTrackerApplication.java # Main entry point + MongoClient bean
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

---

## Prerequisites

- **Java 17** or later
- **Maven** (or use the included `mvnw` wrapper)
- A **MongoDB Atlas** cluster (or any MongoDB URI you have access to)

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/marwanramiz/expense-tracker.git
   cd expense-tracker/expense-tracker
   ```

2. **Configure your environment**

   Update `src/main/resources/application.properties` with your own MongoDB URI and JWT secret (see [Configuration](#configuration) below).

3. **Build the project**
   ```bash
   ./mvnw clean package -DskipTests
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

   The API will start on `http://localhost:8080`.

---

## Configuration

All configuration lives in `application.properties`:

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

> **⚠️ Security recommendation:** Do not commit real credentials to version control. Move these values into environment variables or a `.env`/secrets manager, and add `application.properties` to `.gitignore` before pushing. If credentials have already been committed, rotate them in MongoDB Atlas immediately.

### Why `MongoClient` is created explicitly

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
Returns a signed JWT string on success.

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

> All routes except `/auth/register` and `/auth/login` require a valid JWT in the `Authorization: Bearer <token>` header.

---

## Authentication Flow

1. User registers via `POST /auth/register`.
2. User logs in via `POST /auth/login` and receives a signed JWT (valid for 24 hours).
3. The client includes the JWT in the `Authorization` header on subsequent requests.
4. `JwtFilter` intercepts each request, validates the token, and authenticates the user before it reaches the controller.
5. Sessions are stateless — no server-side session state is stored (`SessionCreationPolicy.STATELESS`).

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

- Passwords are currently stored and compared as plain text — **this should be replaced with hashed passwords (e.g. BCrypt) before any real-world use.**
- CSRF protection is disabled, which is standard for stateless JWT APIs but should be paired with proper CORS configuration in production.
- `jwt.secret` must be at least 32 bytes long for HS256 signing to succeed.

---

## Roadmap

- [ ] Hash passwords with BCrypt
- [ ] Add expense update/delete endpoints
- [ ] Add pagination and filtering (by date range, category)
- [ ] Add input validation with `spring-boot-starter-validation`
- [ ] Add unit and integration tests
- [ ] Externalize secrets via environment variables

---

## Author

**Marwan Ramiz**
[GitHub](https://github.com/marwanramiz) · [LinkedIn](https://linkedin.com/in/marwan-ramiz-m-8584a9326)
