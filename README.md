<div align="center">

# Resume Analyzer AI

**An intelligent, deterministic AI-driven Applicant Tracking System (ATS) and Resume Evaluation Platform.**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Groq](https://img.shields.io/badge/Groq-%23F55036.svg?style=for-the-badge&logo=groq&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

**Resume Analyzer AI** is a high-performance, visually stunning platform designed to mathematically evaluate and score resumes against specific Job Descriptions (JDs). It transforms the black-box process of ATS (Applicant Tracking Systems) into a transparent, actionable scorecard that empowers both recruiters and job seekers.

---

## 🏢 Context & Authorship

> [!NOTE]
> This platform was engineered from scratch as the primary submission for the **Online Assessment Interview (Round 2)** for a Software Engineering Internship at **Solvrex Private Limited**.

> [!IMPORTANT]
> 👤 **Role & Authorship:** I am the **sole developer** of this project. I independently engineered the entire platform, encompassing the React/TypeScript frontend, the Python/FastAPI backend, the database architecture, and the AI integration layer.

---

## 🎯 Executive Overview

### 🚨 The Problem
Modern recruitment relies heavily on automated ATS filters that reject candidates based on opaque keyword-matching algorithms. Candidates often do not know why their resume was rejected, and recruiters struggle to quickly identify the *context* behind a candidate's skills, rather than just the presence of a keyword.

### 💡 The Solution
Resume Analyzer AI bridges this gap. By uploading a resume (PDF/DOCX) and a target Job Description, the application utilizes advanced NLP techniques to generate a comprehensive, explainable scorecard. It highlights exactly which skills are missing, evaluates section completeness, and provides actionable steps to improve the candidate's ATS match rate.

### 🧠 Architectural Paradigm: Local vs. Cloud API
This project was initially architected with a **Local-First, Air-Gapped NLP Pipeline** utilizing local PyTorch models (`sentence-transformers`, `all-MiniLM-L6-v2`) for strict data privacy and semantic extraction. 

However, a core requirement of this assessment was to provide a **live, fully functional deployed web link**. Free-tier cloud hosting environments (such as Render) enforce strict memory limits (512MB RAM), which immediately crash when attempting to load massive local machine learning models into memory. 

To ensure production stability and fulfill the deployment requirement, the architecture was dynamically refactored. **I was forced to bypass the local ML engine and route the heavy NLP processing through a cloud API (Groq - LLaMA 3 70b).** The codebase retains the structural integrity to run 100% locally if deployed on adequate enterprise hardware, demonstrating a flexible, environment-aware engineering approach.

---

## 🏗️ Approach

The system follows a highly structured, multi-stage processing pipeline:

1. **Document Ingestion & Parsing:** The frontend accepts PDF documents and transmits them to the FastAPI backend. The backend utilizes `pdfplumber` to execute robust, layout-aware text extraction, preserving the semantic flow of the resume.
2. **Contextual Augmentation:** The extracted text, along with the user-provided Job Description, target role, and optional GitHub profile data, is assembled into a strict, structured prompt matrix.
3. **AI Evaluation (Groq LLaMA 3 70b):** The matrix is processed by the LLM. Instead of standard chat generation, the model is strictly constrained to return a heavily nested, deterministic JSON schema representing the scorecard.
4. **Data Persistence & UI Hydration:** The backend parses the JSON, persists the history securely in a PostgreSQL database (tied to the user's authenticated session), and streams the result to the React frontend.
5. **Interactive Visualization:** The frontend dynamically renders the scorecard using premium glassmorphic UI components, animated progress rings, and interactive feedback accordions.

---

## 🧮 Scoring Methodology

The final **ATS Match Percentage (0-100%)** is not a random AI hallucination; it is a weighted aggregate of multiple deterministic and semantic sub-scores:

*   **Keyword Relevance (40% Weight):** Measures the semantic overlap and direct presence of mandatory technical skills, frameworks, and methodologies required in the JD versus those found in the resume.
*   **Experience & Context (30% Weight):** Evaluates if the skills mentioned in the resume are backed by quantifiable achievements (e.g., "Improved speed by 20%") rather than just being listed in a skills section.
*   **Section Completeness (15% Weight):** Verifies the structural integrity of the resume (presence of Contact Info, Education, Experience, and Skills sections).
*   **Readability & Formatting (15% Weight):** Analyases the text density, bullet point length, and overall parseability of the document for standard ATS parsers.

These components are synthesized to generate the final overarching score and the categorized "Action Plan" for the user.

---

## 📌 Assumptions Made

During the development of this platform, the following technical and functional assumptions were made to scope the project appropriately for the assessment timeline:

1. **Language:** The platform assumes that both the uploaded resume and the provided Job Description are written in **English**. Multi-lingual NLP processing is currently out of scope.
2. **File Format:** The primary supported and tested file format for resumes is **PDF**. While basic support for text exists, complex graphical resumes (e.g., heavily stylized Canva images) may suffer in text-extraction accuracy.
3. **Single Role Targeting:** Each analysis execution is assumed to target one specific role/JD at a time. Batch processing multiple JDs against a single resume is deferred to future improvements.
4. **Cloud Execution:** It is assumed that the live deployment environment will always have internet access to reach the Groq API, as the local PyTorch fallback was disabled for the deployed build.

---

## 🚀 Future Improvements

If this project were to be scaled into a commercial enterprise product, the following enhancements would be prioritized:

1. **Advanced OCR Integration:** Integrating `Tesseract` or AWS Textract to parse scanned, image-based PDFs that standard text-extractors fail to read.
2. **Local Model Toggle:** Introducing a UI toggle that allows enterprise users running the app locally on powerful hardware to switch from the Groq API back to the local `SentenceTransformers` engine for complete data privacy.
3. **Multi-Tenant Workspaces:** Implementing Role-Based Access Control (RBAC) so recruiting agencies can manage multiple clients, candidates, and job postings within isolated workspaces.
4. **Export to CSV/Excel:** Allowing recruiters to run batch analyses on hundreds of resumes and export the ranked scorecards directly to an Excel sheet.
5. **Real-time Resume Builder:** Adding a feature where the user can click on a "weakness" in their scorecard and the AI instantly suggests a rewritten, ATS-optimized bullet point.

---

## 🛠️ Tech Stack

| Category | Technology | Details |
| :--- | :--- | :--- |
| **Frontend & UI** | React, TypeScript, Vite | High-performance, strictly-typed client architecture. |
| **Styling & Routing**| Tailwind CSS, TanStack Router | Premium glassmorphic styling and instant client-side routing. |
| **Backend API** | Python, FastAPI | Asynchronous, high-throughput RESTful API. |
| **AI & NLP** | Groq (LLaMA 3 70b) | Ultra-fast cloud inference for semantic analysis and JSON generation. |
| **Authentication** | Better-Auth | Secure, robust authentication handling (Email/Password & OAuth). |
| **Database** | PostgreSQL | Relational data persistence for users and analysis history. |

---

## 💻 Local Setup (Development)

To run the application locally on your machine:

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL Database

### Installation
1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd "Resume Analyzer AI"
   ```

2. **Backend Setup:**
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

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   *Create a `.env` file in the frontend directory with your `VITE_API_URL`, database URL, and authentication keys.*
   ```bash
   npm run dev
   ```

---

## 📜 License
This project is licensed under the [MIT License](LICENSE). Copyright (c) 2026.

## 👨‍💻 Author
Engineered with dedication for the **Solvrex Private Limited** Software Engineering Internship Assessment.
