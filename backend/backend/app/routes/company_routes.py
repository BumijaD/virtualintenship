from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database import get_db
from ..models.company import Company

router = APIRouter()


# =====================================================
# COMPANY SIGNUP REQUEST
# =====================================================

class CompanyRegister(BaseModel):
    company_name: str
    email: str
    password: str


# =====================================================
# COMPANY LOGIN REQUEST
# =====================================================

class CompanyLogin(BaseModel):
    email: str
    password: str


# =====================================================
# COMPANY REGISTER / SIGN UP
# =====================================================

@router.post("/companies/register")
def company_register(
    register_data: CompanyRegister,
    db: Session = Depends(get_db)
):
    # Check whether email already exists
    existing_company = (
        db.query(Company)
        .filter(Company.email == register_data.email)
        .first()
    )

    if existing_company:
        return {
            "message": "Email already registered"
        }

    # Create new company
    company = Company(
        company_name=register_data.company_name,
        email=register_data.email,
        password=register_data.password,
        phone="",
        company_address=""
    )

    try:
        db.add(company)
        db.commit()
        db.refresh(company)

        return {
            "message": "Company registered successfully",
            "company_id": company.company_id,
            "company_name": company.company_name,
            "email": company.email
        }

    except IntegrityError:
        db.rollback()

        return {
            "message": "Email already registered"
        }


# =====================================================
# CREATE COMPANY
# =====================================================
# This keeps your existing API working.

@router.post("/companies")
def create_company(
    company_name: str,
    email: str,
    password: str,
    phone: str,
    company_address: str,
    db: Session = Depends(get_db)
):
    existing_company = (
        db.query(Company)
        .filter(Company.email == email)
        .first()
    )

    if existing_company:
        return {
            "message": "Email already exists"
        }

    company = Company(
        company_name=company_name,
        email=email,
        password=password,
        phone=phone,
        company_address=company_address
    )

    try:
        db.add(company)
        db.commit()
        db.refresh(company)

        return {
            "message": "Company registered successfully",
            "company_id": company.company_id
        }

    except IntegrityError:
        db.rollback()

        return {
            "message": "Email already exists"
        }


# =====================================================
# COMPANY LOGIN
# =====================================================

@router.post("/companies/login")
def company_login(
    login_data: CompanyLogin,
    db: Session = Depends(get_db)
):
    company = (
        db.query(Company)
        .filter(
            Company.email == login_data.email
        )
        .first()
    )

    if company is None:
        return {
            "message": "Invalid email or password"
        }

    if company.password != login_data.password:
        return {
            "message": "Invalid email or password"
        }

    return {
        "message": "Company login successful",
        "company_id": company.company_id,
        "company_name": company.company_name,
        "email": company.email
    }


# =====================================================
# GET COMPANY
# =====================================================

@router.get("/companies/{company_id}")
def get_company(
    company_id: int,
    db: Session = Depends(get_db)
):
    company = (
        db.query(Company)
        .filter(Company.company_id == company_id)
        .first()
    )

    if company is None:
        return {
            "message": "Company not found"
        }

    return {
        "company_id": company.company_id,
        "company_name": company.company_name,
        "email": company.email,
        "phone": company.phone,
        "company_address": company.company_address
    }


# =====================================================
# UPDATE COMPANY
# =====================================================

@router.put("/companies/{company_id}")
def update_company(
    company_id: int,
    company_name: str,
    email: str,
    password: str,
    phone: str,
    company_address: str,
    db: Session = Depends(get_db)
):
    company = (
        db.query(Company)
        .filter(Company.company_id == company_id)
        .first()
    )

    if company is None:
        return {
            "message": "Company not found"
        }

    company.company_name = company_name
    company.email = email
    company.password = password
    company.phone = phone
    company.company_address = company_address

    db.commit()
    db.refresh(company)

    return {
        "message": "Company updated successfully",
        "company_id": company.company_id
    }


# =====================================================
# DELETE COMPANY
# =====================================================

@router.delete("/companies/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db)
):
    company = (
        db.query(Company)
        .filter(Company.company_id == company_id)
        .first()
    )

    if company is None:
        return {
            "message": "Company not found"
        }

    db.delete(company)
    db.commit()

    return {
        "message": "Company deleted successfully"
    }


# =====================================================
# COMPANY FORGOT PASSWORD
# =====================================================

@router.post("/companies/forgot-password")
def company_forgot_password(
    email: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    company = (
        db.query(Company)
        .filter(Company.email == email)
        .first()
    )

    if company is None:
        return {
            "message": "Email not found"
        }

    company.password = new_password

    db.commit()

    return {
        "message": "Password reset successfully"
    }