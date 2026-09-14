from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from app.models.student import Student
from app.models.company import Company
from app.models.internship import Internship
from app.models.application import Application
from app.models.admin import Admin
from app.models.admin_activity import AdminActivity
from app.routes.student_routes import router as student_router
from app.routes.company_routes import router as company_router
from app.routes.internship_routes import router as internship_router
from app.routes.application_routes import router as application_router
from app.routes.admin_routes import router as admin_router
from app.routes.admin_activity_routes import router as admin_activity_router
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(student_router)
app.include_router(company_router)
app.include_router(internship_router)
app.include_router(application_router)
app.include_router(admin_router)
app.include_router(admin_activity_router)


@app.get("/")

def home():
    return {
        "message": "Virtual Internship Platform Backend is Running"
    }


@app.get("/test-db")
def test_database():
    try:
        with engine.connect() as connection:
            return {
                "message": "Database connected successfully"
            }
    except Exception as e:
        return {
            "message": "Database connection failed",
            "error": str(e)
        }