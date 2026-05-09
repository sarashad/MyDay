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
| JWT Bearer | latest | Authentication |
| FluentValidation | latest | Input validation |
| Scalar | latest | API documentation |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI Framework |
| TypeScript | 5.x | Type safety |
| Vite | latest | Build tool |
| TanStack Query | v5 | API calls & caching |
| Zustand | latest | State management |
| Tailwind CSS | v4 | Styling |
| React Router | v7 | Navigation |

---

## 📁 Project Structure

```
MyDay/
│
├── 📂 backend/
│   └── MyDay.sln
│       ├── MyDay.API/                  ← ASP.NET Core Web API
│       │   ├── Controllers/            ← API endpoints (TodoController, HabitController...)
│       │   ├── Middleware/             ← Error handling, logging
│       │   ├── Program.cs              ← App entry point
│       │   └── appsettings.json        ← Configuration (DB connection, JWT...)
│       │
│       ├── MyDay.Application/          ← Business logic layer
│       │   ├── Services/               ← TodoService, HabitService, GoalService...
│       │   ├── DTOs/                   ← Data Transfer Objects (what API sends/receives)
│       │   └── Interfaces/             ← Service contracts
│       │
│       ├── MyDay.Domain/               ← Core entities (no dependencies)
│       │   └── Entities/               ← Todo.cs, Habit.cs, Goal.cs, User.cs
│       │
│       └── MyDay.Infrastructure/       ← Data access layer
│           ├── Data/
│           │   └── AppDbContext.cs     ← Entity Framework DbContext
│           ├── Repositories/           ← Database queries
│           └── Migrations/             ← EF Core migrations (auto-generated)
│
├── 📂 frontend/
│   └── myday-client/                   ← React + TypeScript (Vite)
│       ├── src/
│       │   ├── api/                    ← API call functions
│       │   ├── components/             ← Reusable UI components
│       │   │   ├── todo/
│       │   │   ├── habit/
│       │   │   ├── goal/
│       │   │   └── shared/
│       │   ├── pages/                  ← Full pages
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Todos.tsx
│       │   │   ├── Habits.tsx
│       │   │   ├── Goals.tsx
│       │   │   └── Login.tsx
│       │   ├── store/                  ← Zustand global state
│       │   ├── types/                  ← TypeScript interfaces
│       │   ├── hooks/                  ← Custom React hooks
│       │   └── App.tsx                 ← Root component + routing
│       ├── index.html
│       └── vite.config.ts
│
└── 📂 docs/                            ← Screenshots, diagrams (for GitHub)
    └── screenshots/
```

---

## 🗄️ Database Schema

```
Users
├── Id (int, PK)
├── Email (string, unique)
├── PasswordHash (string)
├── FirstName (string)
└── CreatedAt (datetime)

Todos
├── Id (int, PK)
├── UserId (int, FK → Users)
├── Title (string)
├── Description (string, optional)
├── IsCompleted (bool)
├── Priority (enum: Low / Medium / High)
├── DueDate (datetime, optional)
└── CreatedAt (datetime)

Habits
├── Id (int, PK)
├── UserId (int, FK → Users)
├── Name (string)
├── Icon (string, optional)
├── FrequencyDays (int, e.g. every day = 1)
└── CreatedAt (datetime)

HabitLogs
├── Id (int, PK)
├── HabitId (int, FK → Habits)
├── CompletedDate (date)
└── Note (string, optional)

Goals
├── Id (int, PK)
├── UserId (int, FK → Users)
├── Title (string)
├── Description (string, optional)
├── Deadline (datetime, optional)
├── IsCompleted (bool)
└── CreatedAt (datetime)

GoalSteps
├── Id (int, PK)
├── GoalId (int, FK → Goals)
├── Title (string)
└── IsCompleted (bool)
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT token |

### Todos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all my todos |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/{id}` | Update todo |
| PATCH | `/api/todos/{id}/complete` | Mark as done |
| DELETE | `/api/todos/{id}` | Delete todo |

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/habits` | Get all my habits |
| POST | `/api/habits` | Create new habit |
| POST | `/api/habits/{id}/log` | Check habit for today |
| GET | `/api/habits/{id}/streak` | Get current streak |
| DELETE | `/api/habits/{id}` | Delete habit |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | Get all my goals |
| POST | `/api/goals` | Create new goal |
| PUT | `/api/goals/{id}` | Update goal |
| PATCH | `/api/goals/{id}/steps/{stepId}` | Complete a step |
| DELETE | `/api/goals/{id}` | Delete goal |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get today's summary (todos + habits + goals) |

---

## 📅 Build Progress

### ✅ Setup & Infrastructure
- [ ] Visual Studio 2026 installed
- [ ] SQL Server 2025 installed
- [ ] SSMS installed
- [ ] Node.js installed
- [ ] VS Code installed
- [ ] GitHub repository created
- [ ] Solution & projects created (Clean Architecture)
- [ ] Database connection configured
- [ ] EF Core migrations working

### 🔐 Authentication
- [ ] User entity & registration
- [ ] Password hashing
- [ ] JWT token generation
- [ ] Login endpoint
- [ ] Auth middleware (protect routes)

### ✅ Todos (Backend)
- [ ] Todo entity & migration
- [ ] GET all todos
- [ ] POST create todo
- [ ] PUT update todo
- [ ] PATCH mark as complete
- [ ] DELETE todo

### 💪 Habits (Backend)
- [ ] Habit entity & migration
- [ ] GET all habits
- [ ] POST create habit
- [ ] POST log habit for today
- [ ] GET streak calculation
- [ ] DELETE habit

### 🎯 Goals (Backend)
- [ ] Goal & GoalStep entities
- [ ] GET all goals
- [ ] POST create goal with steps
- [ ] PATCH complete a step
- [ ] Auto-complete goal when all steps done
- [ ] DELETE goal

### 📊 Dashboard (Backend)
- [ ] GET today's todos count
- [ ] GET today's habits status
- [ ] GET active goals progress

### ⚛️ Frontend Setup
- [ ] Vite + React + TypeScript project created
- [ ] Tailwind CSS v4 configured
- [ ] React Router v7 configured
- [ ] Zustand store setup
- [ ] TanStack Query setup
- [ ] API base configuration (axios/fetch)

### 🎨 Frontend Pages
- [ ] Login / Register page
- [ ] Dashboard page
- [ ] Todos page (list, add, edit, delete)
- [ ] Habits page (list, add, check-off, streak)
- [ ] Goals page (list, add, steps, progress)

### 🏁 Final Steps
- [ ] Error handling (frontend + backend)
- [ ] Loading states & empty states
- [ ] Responsive design (mobile friendly)
- [ ] Unit tests (backend services)
- [ ] README screenshots added
- [ ] Deploy backend (Railway.app)
- [ ] Deploy frontend (Vercel)

---

## 🛠️ How to Run Locally

### Backend
```bash
cd backend/MyDay.API
dotnet restore
dotnet ef database update
dotnet run
```
API runs at: `https://localhost:5001`  
Scalar API docs: `https://localhost:5001/scalar`

### Frontend
```bash
cd frontend/myday-client
npm install
npm run dev
```
App runs at: `http://localhost:5173`

---

## 📸 Screenshots
*(Coming soon)*

---

## 👩‍💻 Author
**Sara Shadabi** — Full-Stack .NET Developer  
[LinkedIn](https://linkedin.com/in/sara-shadabi) • [GitHub](https://github.com/)
