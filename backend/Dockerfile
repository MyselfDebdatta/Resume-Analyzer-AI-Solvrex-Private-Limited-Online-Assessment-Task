# Hugging Face Spaces Dockerfile
FROM python:3.10-slim

# Hugging Face requires a non-root user with UID 1000
RUN useradd -m -u 1000 user
USER user

# Add local bin to PATH
ENV PATH="/home/user/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Download required spaCy model
RUN python -m spacy download en_core_web_md

# Copy the rest of the application
COPY --chown=user . .

# Hugging Face Spaces expose port 7860
EXPOSE 7860

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
