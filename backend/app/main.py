from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "MindMate API is running 🚀"}