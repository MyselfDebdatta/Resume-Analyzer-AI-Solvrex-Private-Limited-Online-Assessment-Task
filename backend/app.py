import os
import subprocess

# Ensure spacy model is downloaded before importing anything else
def ensure_spacy():
    try:
        import spacy
        spacy.load("en_core_web_md")
    except OSError:
        subprocess.run(["python", "-m", "spacy", "download", "en_core_web_md"])

ensure_spacy()

import spaces

# Create a dummy GPU function to satisfy Hugging Face ZeroGPU hardware checks
@spaces.GPU
def dummy_gpu_function():
    pass

import gradio as gr
from main import app as fastapi_app

# Create a dummy Gradio interface to satisfy the Hugging Face Gradio SDK
demo = gr.Interface(
    fn=lambda: "Resume Analyzer AI Backend is running perfectly! Use the API endpoints.", 
    inputs=None, 
    outputs="text",
    title="Resume Analyzer AI API"
)

# Mount the Gradio app to our FastAPI app at the root path.
# This creates a single ASGI application that Hugging Face can serve.
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

# CRITICAL: Do NOT call uvicorn.run() here! 
# Hugging Face's Gradio SDK automatically runs its own Uvicorn server on port 7860.
# If we call it manually, we get the "address already in use" port collision error.
