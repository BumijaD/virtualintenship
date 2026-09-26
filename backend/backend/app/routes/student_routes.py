from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database import get_db
from ..models.student import Student


router = APIRouter()


# =====================================================
# STUDENT LOGIN
# =====================================================

class StudentLogin(BaseModel):
    email: str
    password: str


# =====================================================
# STUDENT REGISTER
# =====================================================

class StudentRegister(BaseModel):
    name: str
    email: str
    password: str
    phone:str
    college:str
    department:str
    year_of_study:str
    skills:str
    cgpa:str
    resume:str


# =====================================================
# FORGOT PASSWORD
# =====================================================

class StudentForgotPassword(BaseModel):
    email: str
    new_password: str


# =====================================================
# STUDENT PROFILE UPDATE
# =====================================================

class StudentProfileUpdate(BaseModel):
    name: str
    phone: str
    college: str
    department: str
    year_of_study: str
    cgpa: float
    skills: str
    resume: str


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
        cgpa=cgpa,
        college="",
        year_of_study="",
        skills="",
        resume=""
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
# STUDENT REGISTER
# =====================================================

@router.post("/students/register")
def student_register(
    register_data: StudentRegister,
    db: Session = Depends(get_db)
):

    existing_student = (
        db.query(Student)
        .filter(Student.email == register_data.email)
        .first()
    )

    if existing_student:
        return {
            "message": "Email already registered"
        }

    student = Student(
        name=register_data.name,
        email=register_data.email,
        password=register_data.password,
        phone=register_data.phone,
        college=register_data.college,
        department=register_data.department,
        year_of_study=register_data.year_of_study,
        skills=register_data.skills,
        resume=register_data.resume,
        cgpa=register_data.cgpa
    )

    try:

        db.add(student)
        db.commit()
        db.refresh(student)

        return {
            "message": "Registration successful",
            "student_id": student.student_id,
            "name": student.name,
            "email": student.email
        }

    except IntegrityError:

        db.rollback()

        return {
            "message": "Email already registered"
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
# FORGOT PASSWORD
# =====================================================

@router.post("/students/forgot-password")
def student_forgot_password(
    forgot_data: StudentForgotPassword,
    db: Session = Depends(get_db)
):

    student = (
        db.query(Student)
        .filter(Student.email == forgot_data.email)
        .first()
    )

    if student is None:

        return {
            "message": "Email not found"
        }

    student.password = forgot_data.new_password

    db.commit()

    db.refresh(student)

    return {
        "message": "Password reset successfully"
    }


# =====================================================
# GET STUDENT PROFILE
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
        "phone": student.phone or "",
        "college": student.college or "",
        "department": student.department or "",
        "year_of_study": student.year_of_study or "",
        "cgpa": float(student.cgpa) if student.cgpa is not None else 0,
        "skills": student.skills or "",
        "resume": student.resume or ""
    }


# =====================================================
# UPDATE STUDENT PROFILE
# =====================================================

@router.put("/students/{student_id}/profile")
def update_student_profile(
    student_id: int,
    profile_data: StudentProfileUpdate,
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

    student.name = profile_data.name

    student.phone = profile_data.phone

    student.college = profile_data.college

    student.department = profile_data.department

    student.year_of_study = profile_data.year_of_study

    student.cgpa = profile_data.cgpa

    student.skills = profile_data.skills

    student.resume = profile_data.resume

    db.commit()

    db.refresh(student)

    return {
        "message": "Student profile updated successfully",

        "student_id": student.student_id,

        "name": student.name,

        "email": student.email,

        "phone": student.phone,

        "college": student.college,

        "department": student.department,

        "year_of_study": student.year_of_study,

        "cgpa": float(student.cgpa)
        if student.cgpa is not None
        else 0,

        "skills": student.skills,

        "resume": student.resume
    }


# =====================================================
# OLD UPDATE STUDENT
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