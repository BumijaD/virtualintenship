from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from .database import engine, Base
from .models.student import Student
from .models.company import Company
from .models.internship import Internship
from .models.application import Application
from .models.admin import Admin
from .models.admin_activity import AdminActivity

from .routes.student_routes import router as student_router
from .routes.company_routes import router as company_router
from .routes.internship_routes import router as internship_router
from .routes.application_routes import router as application_router
from .routes.admin_routes import router as admin_router
from .routes.admin_activity_routes import router as admin_activity_router


# =====================================================
# CREATE TABLES
# =====================================================

Base.metadata.create_all(bind=engine)


# =====================================================
# ADD NEW STUDENT PROFILE COLUMNS
# =====================================================

def update_student_table():

    inspector = inspect(engine)

    # Check that the student table exists
    if not inspector.has_table("student"):
        return

    existing_columns = {
        column["name"]
        for column in inspector.get_columns("student")
    }

    new_columns = {
        "college": "VARCHAR(150)",
        "year_of_study": "VARCHAR(50)",
        "skills": "TEXT",
        "resume": "VARCHAR(255)"
    }

    with engine.begin() as connection:

        for column_name, column_type in new_columns.items():

            if column_name not in existing_columns:

                connection.execute(
                    text(
                        f"ALTER TABLE student "
                        f"ADD COLUMN {column_name} {column_type} NULL"
                    )
                )


update_student_table()


# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI()


# =====================================================
# CORS CONFIGURATION
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# ROUTERS
# =====================================================

app.include_router(student_router)
app.include_router(company_router)
app.include_router(internship_router)
app.include_router(application_router)
app.include_router(admin_router)
app.include_router(admin_activity_router)


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "message": "Virtual Internship Platform Backend is Running"
    }


# =====================================================
# DATABASE TEST
# =====================================================

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