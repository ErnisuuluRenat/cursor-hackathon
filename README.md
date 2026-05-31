# 🌴 Summer Adventures ELO MVP

A gamified adventure tracker (Strava for summer adventures) where friends plan trips, upload photo proof validated by Claude Vision, and compete on an ELO leaderboard based on "coolness" scores!

Designed and built for the **Cursor Hackathon**.

---

## 🚀 Key Features

* **💬 Conversational Quest Planner**: Plan adventures dynamically in natural language. The AI system gathers details (budget, dates, preferences) and locks in a structured quest plan once ready.
* **🗺️ Adventure Map**: View a futuristic visual overlay mapping all completed crew coordinates and locations with custom visual badges.
* **🔥 Epic Hits Grid**: Highlights the highest coolness rated verified adventures from the squad.
* **🏆 Scoreboard Leaderboard**: Interactive ranked table of squad members showing current ELO ratings and total completed adventures.
* **📸 Photo Proof Verification**: Seamless vision-guided verification that validates photo uploads against designated activities, ensuring anti-cheat and ELO scoring integrity.
* **🐳 Production Docker Deployment**: Unified environment orchestration running both client and server containers.

---

## 🛠 Tech Stack

* **Frontend**: Next.js 14+ (React)
* **Backend**: Django 4.2 + Django REST Framework
* **AI Integration**: Anthropic Messages API (Claude & Claude Vision models)
* **Database**: SQLite (No configuration required)
* **Containerization**: Docker Compose

---

## 🐳 Docker Deployment (Recommended)

Start the entire production environment with a single command:

```bash
docker compose up -d --build
```

### Access Ports:
* **Frontend Dashboard**: [http://localhost:3001](http://localhost:3001)
* **Backend Django API**: [http://localhost:8080](http://localhost:8080)

---

## 👨‍💻 Local Development Setup

If you prefer to run the components natively on your system:

### 1. Backend (Django)

Make sure to activate your virtual environment:

```bash
# Activate virtual environment
source venv/bin/activate

# Apply migrations and seed mock players
python manage.py migrate
python manage.py seed

# Start server
python manage.py runserver 8000
```

### 2. Frontend (Next.js)

```bash
cd summer-adventures-mvp

# Install package dependencies
npm install

# Start Next.js dev server
npm run dev -- -p 3001
```

---

## 🔑 Environment Variables

Copy `.env.local.example` to `.env.local` at the root and add your Anthropic credentials for live AI generation. (Fallback mocks will automatically be used if no key is supplied).

```env
ANTHROPIC_API_KEY=your-api-key-here
```
