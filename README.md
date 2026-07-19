<div align="center">

# Resume Analyzer AI

**A Production-Grade, AI-Driven Applicant Tracking System (ATS) & Semantic Resume Evaluation Platform.**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Groq](https://img.shields.io/badge/Groq-%23F55036.svg?style=for-the-badge&logo=groq&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-Black?style=for-the-badge&logo=framer&logoColor=blue)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

**Resume Analyzer AI** is a highly scalable, visually spectacular platform engineered to demystify the recruitment process. By applying advanced semantic matching and structural heuristics, it mathematically evaluates resumes against targeted Job Descriptions (JDs). It transforms the traditionally opaque "black-box" ATS algorithms into a transparent, actionable, and visually stunning interactive scorecard.

---

## 📑 Table of Contents

| **The Engineering & Logic** | **The Codebase & Infrastructure** |
| :--- | :--- |
| 🏢 [Context & Authorship](#-context--authorship) | ⚙️ [Deep Dive: The Tech Stack](#️-deep-dive-the-tech-stack) |
| 🎯 [Executive Overview](#-executive-overview) | 📂 [Project Repository Structure](#-project-repository-structure) |
| 🧠 [Architectural Paradigm](#-architectural-paradigm-the-hybrid-local-first-strategy) | 💻 [Local Setup (Development)](#-local-setup-development) |
| 🚀 [The Processing Pipeline](#-the-processing-pipeline-approach) | 📜 [License & Author](#-license) |
| 🧮 [Scoring Methodology](#-scoring-methodology) | |
| 📌 [Assumptions Made](#-assumptions-made) | |
| 🔮 [Future Improvements](#-future-improvements) | |

---

## 🏢 Context & Authorship

> [!NOTE]
> This platform was meticulously engineered from scratch as the primary technical submission for the **Online Assessment Interview (Round 2)** for a Software Engineering Internship at **Solvrex Private Limited**.

> [!IMPORTANT]
> 👤 **Role & Authorship:** I am the **sole developer and exclusive architect** of this platform. I independently designed and engineered the entire system—from the React/TypeScript frontend and custom glassmorphic CSS design system, to the Python/FastAPI backend, database schema architecture, and complex AI orchestration layer.

---

## 🎯 Executive Overview

### 🚨 The Industry Problem
In modern corporate recruitment, over 75% of resumes are discarded by Applicant Tracking Systems (ATS) before a human ever reads them. These legacy systems rely on rigid, boolean keyword-matching algorithms. Consequently, highly qualified candidates are frequently rejected simply because they used a synonym, while recruiters suffer through hours of cross-referencing candidate profiles trying to understand the actual context behind a list of skills. 

### 💡 The Engineered Solution
Resume Analyzer AI bridges this massive gap in the HR tech space. When a user uploads a resume (PDF/DOCX) alongside a target Job Description and an optional GitHub profile, the application utilizes Large Language Models (LLMs) and advanced Natural Language Processing (NLP) to read the document like a human recruiter would. It generates a comprehensive, strictly deterministic JSON scorecard that highlights missing skills, evaluates section integrity, scores readability, and provides highly specific, actionable steps to improve the candidate's ATS match rate.

---

## 🧠 Architectural Paradigm: The Hybrid "Local-First" Strategy

A key engineering challenge in modern AI application deployment is balancing **Data Privacy (Local Execution)** with **Infrastructure Constraints (Cloud Hosting)**. 

This project was initially architected with a **Local-First, Air-Gapped NLP Pipeline**. It utilized massive local PyTorch tensor models (specifically `sentence-transformers` and `all-MiniLM-L6-v2`) to perform semantic extraction and scoring directly on the host machine. This design ensures strict PII (Personally Identifiable Information) privacy by guaranteeing that candidate resumes never leave the local server.

**The Pivot for Deployment:**
However, a core requirement of this assessment was to provide a **live, fully functional, publicly deployed web link**. Free-tier cloud hosting environments (such as Render) enforce extreme hardware constraints—specifically a hard limit of **512 MB of RAM**. Attempting to load a 300MB+ PyTorch model alongside a FastAPI web server instantly triggers an *Out-Of-Memory (OOM)* kernel panic, crashing the deployment.

To ensure production stability while fulfilling the assessment criteria, I engineered a highly resilient structural pivot: **I dynamically bypassed the local ML engine and routed the heavy NLP inference through an ultra-fast Cloud API (Groq's LLaMA 3 70b).** 
*   **The Result:** The backend now runs on less than 40MB of RAM, booting instantly on Render's free tier without crashing.
*   **The Significance:** The codebase retains the structural integrity and modularity to effortlessly switch back to 100% local, air-gapped processing if deployed on adequate enterprise hardware (e.g., a server with 8GB+ RAM). This demonstrates a pragmatic, environment-aware, and highly adaptable software engineering approach.

---

## 🚀 The Processing Pipeline (Approach)

The internal logic of the platform operates through a rigorous, multi-stage pipeline:

1. **Robust Ingestion:** The frontend transmits the multi-page PDF/DOCX to the FastAPI backend via a multipart form data stream.
2. **Spatial Extraction:** `pdfplumber` executes a layout-aware text extraction, stripping out raw formatting while retaining the hierarchical importance of headings, bullet points, and chronological dates.
3. **Contextual Assembly Matrix:** The extracted raw text, the target Job Description, the specific role title, and any external signals (like a GitHub URL) are programmatically combined into a highly specific "System Prompt Matrix."
4. **Deterministic AI Enforcement:** LLMs are notoriously prone to "hallucination." To prevent this, the LLaMA 3 model is mathematically constrained via system instructions to output *only* valid JSON matching a strict Pydantic schema. It acts not as a chatbot, but as a deterministic rule-engine.
5. **Session-Bound Persistence:** The generated scorecard is attached to the authenticated user's unique ID and persisted via SQLAlchemy to the PostgreSQL database, ensuring they can revisit their "History Vault" at any time.
6. **Hydration & Animation:** The React frontend receives the JSON payload and hydrates the UI. Custom animations trigger—progress rings fill up, action items stagger their entrance, and the final score is revealed dynamically.

---

## 🧮 Scoring Methodology

The final **ATS Match Percentage (0-100%)** is not a random number picked by an AI. It is a strictly weighted, mathematically aggregated calculation composed of multiple sub-scores:

*   **[40% Weight] Keyword Relevance & Semantic Overlap:** Does not just check for exact string matches. It understands that "React.js" in the JD and "React18" in the resume are semantically identical. It measures the density of required skills vs. present skills.
*   **[30% Weight] Contextual Experience Integration:** It heavily penalizes candidates who simply dump keywords in a "Skills" section. It rewards candidates whose bullet points integrate those skills alongside quantifiable metrics (e.g., "Reduced latency by 15% using Redis").
*   **[15% Weight] Structural Completeness:** Verifies standard ATS parsability requirements. Did the candidate include a Contact section? Is there a clear Chronological Experience section? Is the Education clearly defined?
*   **[15% Weight] Formatting & Readability Index:** Evaluates the cognitive load required to read the resume. Heavily dense paragraphs are penalized; concise, action-verb-driven bullet points are rewarded.

These components are synthesized to generate the final overarching score and the categorized "Action Plan".

---

## 📌 Assumptions Made

To scope this project appropriately for the assessment timeline, the following technical boundaries were assumed:

1. **Language Standardization:** The platform assumes that both the uploaded resume and the Job Description are written in **English**. Multi-lingual semantic analysis is currently out of scope.
2. **File Format Constraints:** The primary supported and actively tested format is **Standard PDF**. While basic fallback support for raw text exists, highly complex graphical resumes (e.g., heavily stylized Canva images with embedded vectors) may suffer in text-extraction accuracy compared to standard ATS-friendly formats.
3. **Single-Target Analysis:** Each execution targets exactly one specific JD. The ability to batch-process a single resume against a database of 50 open positions is deferred.
4. **Cloud Execution Mandate:** It is assumed that the live deployment environment will always have active internet access to reach the Groq API endpoint, as the local PyTorch fallback was explicitly disabled to prevent Render server crashes.

---

## 🔮 Future Improvements

If this prototype were to be scaled into a commercial SaaS product for Enterprise HR departments, the following roadmap would be executed:

1. **Advanced Document Intelligence (OCR):** Integrating `Tesseract` or AWS Textract to parse poorly scanned, image-based PDFs that standard text-extractors fail to read.
2. **Local Privacy Toggle:** Introducing a UI settings panel that allows enterprise clients (running the app locally on heavy hardware) to switch from the Groq API back to the local `SentenceTransformers` engine for zero-trust data privacy.
3. **Multi-Tenant RBAC Workspaces:** Implementing Role-Based Access Control so recruiting agencies can manage multiple distinct clients, sort thousands of candidates, and manage job postings within isolated, secure workspaces.
4. **Export to CSV/Excel:** Allowing recruiters to run batch analyses on hundreds of resumes and export the ranked comparative matrix directly to an Excel sheet for stakeholder review.
5. **Real-time Resume Builder & Auto-Fix:** Adding a feature where the user can click on a "Weakness" in their scorecard, and the platform will instantly suggest a rewritten, highly ATS-optimized bullet point that they can copy/paste directly into their resume.

---

## ⚙️ Deep Dive: The Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | React.js (Vite), TypeScript | High-performance, strictly-typed client architecture. |
| **Routing & State** | TanStack Router & React Query | Type-safe client-side routing and asynchronous state management. |
| **Styling & UI** | Tailwind CSS, Radix UI | Bespoke `.glass-strong` Glassmorphism design and accessible headless UI primitives. |
| **Animations** | Framer Motion, tw-animate-css | Smooth layout transitions and complex micro-animations. |
| **Forms & Validation** | React Hook Form, Zod | Robust form state management with strict TypeScript schema validation. |
| **Auth & Email** | Better-Auth, Resend, Nodemailer | Modern, headless secure authentication and transactional email delivery. |
| **Export Tools** | html2canvas, jsPDF | Client-side rendering of the UI to generate downloadable PDF scorecards. |
| **Backend API** | Python 3, FastAPI, Uvicorn | Asynchronous, non-blocking I/O API utilizing Pydantic for validation. |
| **Database & ORM** | PostgreSQL (Supabase), Prisma ORM | Scalable cloud database via Supabase, strictly-typed with Prisma. |
| **Containerization**| Docker, Docker Compose | Containerized local environment for isolated PostgreSQL database hosting. |
| **AI & NLP** | Groq (LLaMA 3 70b), scikit-learn, sentence-transformers | Hybrid architecture: fully capable of Local Air-Gapped execution via `sentence-transformers` & `scikit-learn`, but forced to use Groq API for cloud deployment constraints. |
| **Data Processing** | pdfplumber, python-docx, python-multipart | Spatial-aware PDF extraction and robust DOCX file parsing. |
| **Deployment** | Vercel (Frontend), Render (Backend)| Edge Network hosting for React and scalable Cloud Web Service for Python. |

This platform was built using a cutting-edge, strictly typed, and highly asynchronous technology stack designed for enterprise scalability.

### 🎨 Frontend Ecosystem (React & TypeScript)
*   **React.js & Vite:** Chosen for blazing-fast Hot Module Replacement (HMR) during development and highly optimized, minified production builds.
*   **TypeScript & Zod:** Implemented end-to-end to enforce strict type safety. Zod is used for runtime schema validation, which is absolutely critical when handling highly nested JSON payloads returned by the AI, completely eliminating unpredictable runtime errors.
*   **Tailwind CSS & Radix UI:** Gone are the days of generic Bootstrap themes. I combined heavily customized Tailwind configurations with Radix UI's accessible, headless primitives to build a bespoke **"Glassmorphism" design system**.
*   **Framer Motion:** Utilized to orchestrate fluid layout transitions, stagger animations for the scorecard elements, and provide a premium "app-like" feel.
*   **TanStack Ecosystem (Router & Query):** Replaced traditional routing and fetching mechanisms. `TanStack Router` provides type-safe, instant client-side routing with custom `pendingComponent` states. `TanStack Query` handles asynchronous data fetching, aggressive caching, and background synchronization.
*   **Forms & PDF Export:** `React Hook Form` handles complex form state without re-rendering the entire DOM. `html2canvas` and `jsPDF` are leveraged to render the HTML dashboard directly into a pixel-perfect, downloadable PDF report purely on the client side.
*   **Authentication & Comms:** `Better-Auth` provides headless, secure session management and OAuth integrations, while `Resend` and `Nodemailer` handle robust transactional email delivery.

### 🛠️ Backend & AI Ecosystem (Python, PostgreSQL, Supabase)
*   **Python 3, FastAPI & Uvicorn:** Selected over Django/Flask because FastAPI is built on Starlette and Pydantic. It allows for highly concurrent, asynchronous (`async/await`) non-blocking I/O processing, running seamlessly on the Uvicorn ASGI server.
*   **AI & NLP (Local-First vs Groq API):** The core AI logic is built to be inherently **API-Agnostic**. The architecture supports full, local air-gapped processing using `scikit-learn` and local PyTorch `sentence-transformers` for strict enterprise privacy. However, to bypass the severe 512MB RAM limit of free-tier cloud deployment, the live deployed link is **forced** to utilize the Groq API (LLaMA 3 70b) as a fallback.
*   **Data Processing (`pdfplumber` & `python-docx`):** Standard OCR tools often scramble text when encountering columns or tables. `pdfplumber` was specifically chosen for its spatial-awareness, preserving the hierarchical layout before semantic analysis. We also integrated `python-docx` and `python-multipart` to flawlessly handle native Word document uploads.
*   **Database & Containerization (Docker):** To ensure a perfectly isolated local development environment that mimics production, the local PostgreSQL database is containerized using **Docker**. A configured `docker-compose.yml` ensures developers can spin up a dedicated `postgres:15-alpine` instance (with persistent volume mounting) instantly. For cloud deployment, this transitions to the managed **Supabase** platform, connected seamlessly via the **Prisma ORM** for type-safe schema migrations.

---

## 📂 Project Repository Structure

The repository is structured as a monorepo, cleanly separating the React frontend client from the Python FastAPI backend, ensuring isolated dependencies and deployment lifecycles.

```text
Resume-Analyzer-AI/
├── frontend/                     # React.js & Vite Client
│   ├── src/
│   │   ├── components/           # Reusable Radix UI & Tailwind glassmorphic components
│   │   ├── routes/               # TanStack Router page definitions (Dashboard, History)
│   │   ├── lib/                  # Authentication clients (better-auth) and utilities
│   │   ├── index.css             # Tailwind config and global .glass-strong styles
│   │   └── main.tsx              # Application entry point
│   ├── prisma/                   # Prisma ORM schema definitions for the frontend API
│   ├── package.json              # Node.js dependencies
│   └── tsconfig.json             # TypeScript strict configurations
│
├── backend/                      # Python FastAPI Server
│   ├── api/                      # REST API endpoints (routers for parsing, scoring)
│   ├── core/                     # Application configurations and Pydantic schemas
│   ├── services/                 # NLP logic (Groq API integrations, pdfplumber)
│   ├── main.py                   # FastAPI application entry point
│   └── requirements.txt          # Python dependencies
│
├── .gitignore                    # Environment variable and build artifact exclusions
├── render.yaml                   # Render Blueprint for automated backend deployment
├── docker-compose.yml            # Docker containerization for local PostgreSQL database
├── README.md                     # Comprehensive project documentation
├── SECURITY.md                   # Enterprise security & data privacy policies
└── CONTRIBUTING.md               # Guidelines for open-source contributions
```

---

## 💻 Local Setup (Development)

To run the application locally on your machine, you must utilize the containerized database alongside the dual-stack servers:

### Prerequisites
- Node.js 18+
- Python 3.10+
- **Docker Desktop** (For running the local PostgreSQL container)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd "Resume Analyzer AI"
   ```

2. **Spin Up the Database (Docker):**
   *Ensure Docker Desktop is running on your machine.*
   ```bash
   docker-compose up -d
   ```
   *This pulls the `postgres:15-alpine` image and hosts the database locally on port 5433.*

3. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   *Create a `.env` file in the backend directory with your `GROQ_API_KEY`.*
   ```bash
   uvicorn main:app --reload --port 8000
   ```

4. **Frontend Setup & Prisma Migration:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   *Create a `.env` file in the frontend directory with your database connection string pointing to the running Docker container (`postgresql://root:rootpassword@localhost:5433/resumepilot`)*
   ```bash
   npx prisma db push  # Push the schema to the Docker database
   npm run dev
   ```

---

## 📜 License
This project is licensed under the [MIT License](LICENSE). Copyright (c) 2026.

## 👨‍💻 Author
Engineered with absolute dedication by **Debdatta Panda** for the **Solvrex Private Limited** Software Engineering Internship Assessment.
