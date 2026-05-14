# 🌟 MyDay — Personal Life Planner

> A full-stack personal planner app to manage daily tasks, habits, and goals.  
> Built with **ASP.NET Core 9**, **React 19**, **TypeScript**, **Entity Framework Core 9**, and **SQL Server 2025**.

---

## 🚀 Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| .NET | 9 | Runtime |
| ASP.NET Core | 9 | Web API Framework |
| Entity Framework Core | 9 | ORM / Database access |
| SQL Server | 2025 | Database |
| JWT Bearer | 9.0.4 | Authentication |
| BCrypt.Net | 4.1.0 | Password hashing |
| Scalar | latest | API documentation |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.6 | UI Framework |
| TypeScript | 6.0.3 | Type safety |
| Vite | 8.0.11 | Build tool |
| TanStack Query | v5.100.9 | API calls & caching |
| Zustand | 5.0.13 | State management |
| Tailwind CSS | v4.3.0 | Styling |
| React Router | v7.15.0 | Navigation |
| Axios | 1.16.0 | HTTP client |

---

## 📁 Project Structure

```
MyDay/
│
├── 📂 backend/
│   └── MyDay/
│       ├── MyDay.API/                  ← ASP.NET Core Web API
│       │   ├── Controllers/            ← AuthController, TodoController, HabitController, GoalController
│       │   ├── Middleware/             ← Error handling
│       │   ├── Program.cs              ← App entry point
│       │   └── appsettings.json        ← DB connection, JWT config
│       │
│       ├── MyDay.Application/          ← Business logic layer
│       │   ├── Services/               ← AuthService, TodoService, HabitService, GoalService
│       │   ├── DTOs/                   ← Request/Response models
│       │   └── Interfaces/             ← Service contracts
│       │
│       ├── MyDay.Domain/               ← Core entities (no dependencies)
│       │   └── Entities/               ← User, Todo, Habit, HabitLog, Goal, GoalStep
│       │
│       └── MyDay.Infrastructure/       ← Data access layer
│           ├── Data/AppDbContext.cs     ← EF Core DbContext
│           └── Migrations/             ← EF Core migrations
│
└── 📂 frontend/
    └── myday-client/                   ← React + TypeScript (Vite)
        └── src/
            ├── api/                    ← axios, auth, todos, habits, goals
            ├── components/             ← Layout, shared components
            ├── pages/                  ← Dashboard, Todos, Habits, Goals, Login, Register
            ├── store/                  ← Zustand auth store
            ├── types/                  ← TypeScript interfaces
            └── App.tsx                 ← Root component + routing
```

---

## 🗄️ Database Schema

```
Users         → Id, Email (unique), PasswordHash, FirstName, CreatedAt
Todos         → Id, UserId (FK), Title, Description, IsCompleted, Priority, DueDate, CreatedAt
Habits        → Id, UserId (FK), Name, Icon, TargetCount, CreatedAt
HabitLogs     → Id, HabitId (FK), CompletedDate, Count, Note
Goals         → Id, UserId (FK), Title, Description, Deadline, IsCompleted, CreatedAt
GoalSteps     → Id, GoalId (FK), Title, IsCompleted
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT token |

### Todos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todo` | Get all my todos |
| POST | `/api/todo` | Create new todo |
| PUT | `/api/todo/{id}` | Update todo |
| PATCH | `/api/todo/{id}/complete` | Toggle complete |
| DELETE | `/api/todo/{id}` | Delete todo |

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/habit` | Get all my habits |
| POST | `/api/habit` | Create new habit |
| POST | `/api/habit/{id}/log` | Log habit for today (+1 count) |
| POST | `/api/habit/{id}/undo` | Undo last log |
| DELETE | `/api/habit/{id}` | Delete habit |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goal` | Get all my goals |
| POST | `/api/goal` | Create new goal with steps |
| PUT | `/api/goal/{id}` | Update goal |
| PATCH | `/api/goal/{goalId}/steps/{stepId}` | Toggle step complete |
| DELETE | `/api/goal/{id}` | Delete goal |

---

## ✨ Features

- 🔐 JWT Authentication (register, login, protected routes)
- ✅ **Todos** — daily planner with date filter, priority sorting (High/Medium/Low), expired detection, edit
- 💪 **Habits** — daily count targets, progress bar, streak tracking, undo support
- 🎯 **Goals** — step-by-step progress, auto-complete when all steps done, edit
- 📊 **Dashboard** — today's overview with stats, habit status, goal progress
- 🎨 Color-coded priorities (Red/Orange/Yellow), Purple for expired, Green for completed

---

## 🛠️ How to Run Locally

### Backend
```bash
cd backend/MyDay/MyDay.API
dotnet restore
dotnet ef database update --project ../MyDay.Infrastructure/MyDay.Infrastructure.csproj --startup-project MyDay.API.csproj
dotnet run
```
API: `https://localhost:7299`  
Scalar docs: `https://localhost:7299/scalar`

### Frontend
```bash
cd frontend/myday-client
npm install
npm run dev
```
App: `http://localhost:5173`

---

## 📅 Build Progress

### ✅ Setup & Infrastructure
- [x] Visual Studio 2026 installed
- [x] SQL Server 2025 installed
- [x] Node.js & VS Code installed
- [x] GitHub repository created
- [x] Clean Architecture solution (4 projects)
- [x] EF Core migrations working

### 🔐 Authentication
- [x] User entity & registration
- [x] Password hashing (BCrypt)
- [x] JWT token generation
- [x] Login endpoint
- [x] Auth middleware (protect routes)

### ✅ Todos
- [x] Todo entity & migration
- [x] GET / POST / PUT / PATCH / DELETE
- [x] Date filter & expired detection
- [x] Priority sorting & color coding
- [x] Edit inline

### 💪 Habits
- [x] Habit entity & migration
- [x] GET / POST / DELETE
- [x] Daily count target & progress bar
- [x] Streak calculation
- [x] Log & undo support

### 🎯 Goals
- [x] Goal & GoalStep entities
- [x] GET / POST / PUT / DELETE
- [x] Step completion & auto-complete
- [x] Progress bar & percentage
- [x] Edit inline

### ⚛️ Frontend
- [x] Vite + React + TypeScript
- [x] Tailwind CSS v4
- [x] React Router v7
- [x] Zustand auth store
- [x] TanStack Query
- [x] Login / Register pages
- [x] Dashboard page
- [x] Todos page
- [x] Habits page
- [x] Goals page

### 🏁 Final Steps
- [ ] Unit tests (backend services)
- [ ] Screenshots added to README
- [ ] Deploy backend (Railway.app)
- [ ] Deploy frontend (Vercel)

---

## 📸 Screenshots
*(Coming soon)*

---

## 👩‍💻 Author
**Sara Shadabi** — Full-Stack .NET Developer  
[LinkedIn](https://linkedin.com/in/sara-shadabi) • [GitHub](https://github.com/sarashad/MyDay)
