import os
import subprocess
import gradio as gr
from main import app as fastapi_app

# Ensure spacy model is downloaded before importing anything else
def ensure_spacy():
    try:
        import spacy
        spacy.load("en_core_web_md")
    except OSError:
        subprocess.run(["python", "-m", "spacy", "download", "en_core_web_md"])

ensure_spacy()

# Create a dummy Gradio interface to satisfy the Hugging Face Gradio SDK
demo = gr.Interface(
    fn=lambda: "Resume Analyzer AI Backend is running perfectly! Use the API endpoints.", 
    inputs=None, 
    outputs="text",
    title="Resume Analyzer AI API"
)

# Mount the Gradio app to our FastAPI app at the root path.
app = gr.mount_gradio_app(fastapi_app, demo, path="/")
