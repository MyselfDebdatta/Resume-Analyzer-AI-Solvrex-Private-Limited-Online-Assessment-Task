import os
import subprocess
import uvicorn
import gradio as gr

# Ensure the required spaCy model is downloaded before the server starts
def ensure_spacy_model():
    try:
        import spacy
        spacy.load("en_core_web_md")
    except OSError:
        print("Downloading en_core_web_md...")
        subprocess.run(["python", "-m", "spacy", "download", "en_core_web_md"])

ensure_spacy_model()

# Import the FastAPI app after ensuring dependencies are ready
from main import app as fastapi_app

# Create a dummy Gradio interface to satisfy Hugging Face Spaces SDK
demo = gr.Interface(
    fn=lambda: "Resume Analyzer AI Backend is running perfectly. Use /api/v1/analyze/ for analysis.", 
    inputs=None, 
    outputs="text",
    title="Resume Analyzer AI API"
)

# Mount the Gradio app to our FastAPI app at the root path
# This allows Hugging Face to see Gradio, while preserving our FastAPI routes
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
