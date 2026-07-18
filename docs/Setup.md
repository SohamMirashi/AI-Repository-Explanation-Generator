# Setup Instructions

## Prerequisites

- Node.js 20+
- Python 3.11+
- Git
- OpenRouter API Key

---

## Clone Repository

```bash
git clone <repository-url>
cd RepoInsight
```

---

## Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs at:

http://localhost:8000

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

http://localhost:3000

---

## Environment Variables

Create:

```
backend/.env
```

using:

```
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b
```

---

Open the frontend.

Upload a ZIP repository.

Select explanation level.

Generate documentation.

Download ZIP.