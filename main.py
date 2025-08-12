# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import run_all_models

app = FastAPI()

# Allow frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/models")
def get_model_results():
    return run_all_models()
