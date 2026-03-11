from src.routes.api import router
from src.scripts.seed import seed_database
import uvicorn
from fastapi import FastAPI


app = FastAPI()

app.include_router(router)

if __name__ == "__main__":
    seed_database()
    uvicorn.run(app, host="0.0.0.0", port=5000)
