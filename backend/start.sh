#!/bin/bash
set -e

# Force Python to print logs immediately without buffering
export PYTHONUNBUFFERED=1

# Prevent PyTorch from spawning too many threads on small instances and hanging
export OMP_NUM_THREADS=1

# Start the server using Render's provided $PORT environment variable
echo "Starting Uvicorn server..."
exec uvicorn main:app --host 0.0.0.0 --port $PORT
