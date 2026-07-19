# Contributing to Resume Analyzer AI

First off, thank you for considering contributing to Resume Analyzer AI! It's engineers, designers, and enthusiasts like you that make the open-source community such an incredible place to learn, inspire, and create.

This document outlines the process for contributing to the project to ensure a smooth, collaborative, and highly professional workflow.

## 🤝 How Can I Contribute?

There are many ways you can contribute to this project, ranging from writing code and fixing bugs to improving our documentation and designing new UI components.

### 🐛 Reporting Bugs
If you find a bug in the source code (e.g., a specific PDF format fails to parse, or the UI glitches on mobile devices), you can help us by submitting an issue to our GitHub Repository. Even better, you can submit a Pull Request with a fix!

Before creating bug reports, please check the existing GitHub Issues to see if the problem has already been reported. When you are creating a bug report, please include as much detail as possible:
* **Clear Title:** Use a descriptive title that summarizes the issue.
* **Reproduction Steps:** Describe the exact steps which reproduce the problem.
* **Payload Examples:** Provide specific examples (like the exact JD text you used) to demonstrate the steps.
* **Expected vs Actual Behavior:** Explain exactly what you expected to see (e.g., "The scorecard should render 85%") and what actually happened (e.g., "The app crashed with a 500 Internal Server Error").
* **Environment Details:** Mention your OS, Browser version, and whether you were running the local environment or the deployed link.

### ✨ Suggesting Enhancements
Enhancement suggestions are tracked as GitHub issues. We love hearing your ideas for new features (like adding CSV exports or integrating new OCR engines). When creating an enhancement suggestion, please include:
* A step-by-step description of the suggested enhancement in as much detail as possible.
* An explanation of why this enhancement would be useful to most users or how it improves the enterprise viability of the platform.
* Any UI/UX mockups or wireframes if you are suggesting a visual change.

### 🚀 Pull Requests (The Workflow)
We actively welcome your pull requests! To ensure code quality and stability, please follow this strict workflow:

1. **Fork the Repository:** Fork the repo and create your working branch from `main`.
2. **Branch Naming Convention:** Name your branch descriptively (e.g., `feat/add-csv-export`, `fix/pdf-parsing-error`, `docs/update-readme`).
3. **Write Tests:** If you've added complex backend logic (like a new parsing algorithm), add appropriate unit tests in Python.
4. **Update Documentation:** If you've changed the API payload structure or added new environment variables, update the `README.md`.
5. **Linting is Mandatory:** Make sure your code lints perfectly. 
   - For Frontend: Run `npm run lint` and ensure no TypeScript errors exist.
   - For Backend: Ensure PEP 8 compliance and proper type-hinting.
6. **Submit the PR:** Issue that pull request! Provide a detailed description of what the PR accomplishes.

## 💻 Development Environment Setup

This project uses a dual-stack architecture. You must run both the backend and frontend simultaneously for local development.

### 1. Backend (Python/FastAPI)
Navigate to the `/backend` directory. We strictly recommend using a virtual environment (`venv`) to avoid polluting your global Python packages. Install the dependencies listed in `requirements.txt`.
You will need to configure your `.env` file with a valid `GROQ_API_KEY` for the AI to function locally.

### 2. Frontend (React/Vite)
Navigate to the `/frontend` directory. Run `npm install` to grab all dependencies. You will need to configure your frontend `.env` with the `VITE_API_URL` pointing to your local FastAPI server (usually `http://localhost:8000`).

## 📝 Code Style & Linting Guidelines
* **Frontend (TypeScript/React):** We use ESLint and Prettier. Strict typing is enforced. Do not use `any` unless absolutely necessary; always define proper Interfaces for your component props. We use Tailwind CSS for all styling—avoid writing custom CSS files unless creating complex keyframe animations that Tailwind cannot handle.
* **Backend (Python):** We adhere to PEP 8 guidelines. Asynchronous programming (`async def`) should be used for all I/O bound operations (like database calls and API requests) to maintain high throughput.

## 📄 License & Attribution
By contributing your code to this repository, you agree that your contributions will be licensed under the project's MIT License. You retain attribution for your work via Git commit history.
