# Security Policy

## Supported Versions

Currently, only the latest version of the `main` branch is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| older   | :x:                |

## Reporting a Vulnerability

Security is a top priority for Resume Analyzer AI, especially concerning the handling of sensitive PII (Personally Identifiable Information) found within uploaded resumes.

If you discover a security vulnerability within this project, please DO NOT disclose it publicly in the GitHub issues tracker. 

Instead, please send an email privately to the repository maintainer. 

We take all security vulnerabilities seriously and will respond to your report within 48 hours. We will strive to keep you informed of our progress towards a fix and full announcement.

## Scope of Security

When reporting a vulnerability, please provide the following information:
* A description of the vulnerability and its impact.
* Exact instructions to reproduce the vulnerability (including any specific PDF documents or JD text that triggers the issue).
* The environment (e.g., local development, specific cloud hosting provider) where the vulnerability was observed.

## Secure Architecture Principles
* **No Stored Documents:** The system parses uploaded PDF resumes in-memory. Once the text is extracted and the scorecard is generated, the original PDF file is immediately discarded from RAM. We do not store raw resumes in our database or file system.
* **Environment Variables:** All API keys (e.g., Groq API, Database URLs, Auth Secrets) must be strictly managed via `.env` files and environment variables. Keys are never hardcoded into the source code.
* **Cloud API Safety:** By using cloud API integrations for production deployments, we ensure that the host machine's memory boundaries are strictly maintained, preventing memory-leak-based exploits.
