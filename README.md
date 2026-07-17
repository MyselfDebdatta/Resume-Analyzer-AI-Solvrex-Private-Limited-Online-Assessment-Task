# Resume Analyzer AI 🚀

A full-stack, industry-grade AI application that analyzes PDF resumes against job descriptions, using advanced NLP embeddings and LLMs to generate highly accurate, structured scorecards.

## Architecture

This project is structured as a **Monorepo** with two completely decoupled environments:

### `/frontend`
The client application is a modern React SPA built with **TanStack Start** and **Vite**.
- **Styling**: Tailwind CSS & Vanilla CSS (with premium glassmorphism and dynamic mesh gradients).
- **Routing**: TanStack Router (`routes/` directory).
- **Authentication**: Better Auth with Prisma PostgreSQL adapter.

### `/backend`
The AI engine is a high-performance Python application built with **FastAPI**.
- **PDF Extraction**: `pdfplumber` (for handling complex, multi-column layouts).
- **Semantic Similarity**: `SentenceTransformers` (`all-MiniLM-L6-v2`) for generating cosine similarity ATS scores based on true semantic meaning, not just keyword matching.
- **LLM Reasoning**: **Groq (LLaMA 3 70b)** for lightning-fast, structured JSON scorecard generation and actionable feedback.

---

## Getting Started

Because this is a monorepo, you need to run two separate terminal windows for local development.

### 1. Start the React Frontend

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies (if not already done):
```bash
npm install
```

Start the development server and database studio:
```bash
npx prisma studio
npm run dev
```
The frontend will be live on `http://localhost:5173`.

### 2. Start the AI Backend

Navigate to the backend directory:
```bash
cd backend
```

Activate the Python virtual environment:
```bash
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
The AI Engine will be live on `http://localhost:8000`.

---

## Environment Variables

Make sure to configure your `.env` files correctly in both directories:

**`frontend/.env`**
- `DATABASE_URL` (PostgreSQL connection string)
- Auth secrets

**`backend/.env`**
- `GROQ_API_KEY` (Required for LLM analysis)
