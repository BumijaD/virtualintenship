from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database import get_db
from ..models.student import Student

router = APIRouter()


# =====================================================
# STUDENT LOGIN REQUEST
# =====================================================

class StudentLogin(BaseModel):
    email: str
    password: str


# =====================================================
# CREATE STUDENT
# =====================================================

@router.post("/students")
def create_student(
    name: str,
    email: str,
    password: str,
    phone: str,
    department: str,
    cgpa: float,
    db: Session = Depends(get_db)
):
    existing_student = (
        db.query(Student)
        .filter(Student.email == email)
        .first()
    )

    if existing_student:
        return {
            "message": "Email already exists"
        }

    student = Student(
        name=name,
        email=email,
        password=password,
        phone=phone,
        department=department,
        cgpa=cgpa
    )

    try:
        db.add(student)
        db.commit()
        db.refresh(student)

        return {
            "message": "Student registered successfully",
            "student_id": student.student_id
        }

    except IntegrityError:
        db.rollback()

        return {
            "message": "Email already exists"
        }


# =====================================================
# STUDENT LOGIN
# =====================================================

@router.post("/students/login")
def student_login(
    login_data: StudentLogin,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(Student.email == login_data.email)
        .first()
    )

    if student is None:
        return {
            "message": "Invalid email or password"
        }

    if student.password != login_data.password:
        return {
            "message": "Invalid email or password"
        }

    return {
        "message": "Login successful",
        "student_id": student.student_id,
        "name": student.name,
        "email": student.email
    }


# =====================================================
# GET STUDENT
# =====================================================

@router.get("/students/{student_id}")
def get_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(Student.student_id == student_id)
        .first()
    )

    if student is None:
        return {
            "message": "Student not found"
        }

    return {
        "student_id": student.student_id,
        "name": student.name,
        "email": student.email,
        "phone": student.phone,
        "department": student.department,
        "cgpa": float(student.cgpa)
    }


# =====================================================
# UPDATE STUDENT
# =====================================================

@router.put("/students/{student_id}")
def update_student(
    student_id: int,
    name: str,
    phone: str,
    department: str,
    cgpa: float,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(Student.student_id == student_id)
        .first()
    )

    if student is None:
        return {
            "message": "Student not found"
        }

    student.name = name
    student.phone = phone
    student.department = department
    student.cgpa = cgpa

    db.commit()
    db.refresh(student)

    return {
        "message": "Student updated successfully",
        "student_id": student.student_id
    }


# =====================================================
# DELETE STUDENT
# =====================================================

@router.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(Student.student_id == student_id)
        .first()
    )

    if student is None:
        return {
            "message": "Student not found"
        }

    db.delete(student)
    db.commit()

    return {
        "message": "Student deleted successfully"
    }