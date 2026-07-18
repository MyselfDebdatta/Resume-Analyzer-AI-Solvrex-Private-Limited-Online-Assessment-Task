#!/bin/bash
set -e

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Downloading Spacy model..."
python -m spacy download en_core_web_md

echo "Pre-downloading Hugging Face AI models..."
# This ensures the model is downloaded during the build phase, 
# so Uvicorn doesn't time out during startup!
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

echo "Build complete!"
