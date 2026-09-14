from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.admin import Admin

router = APIRouter()


@router.post("/admins")
def create_admin(
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    admin = Admin(
        name=name,
        email=email,
        password=password
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return {
        "message": "Admin registered successfully",
        "admin_id": admin.admin_id
    }
@router.post("/admins/login")
def admin_login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(
        Admin.email == email,
        Admin.password == password
    ).first()

    if admin is None:
        return {
            "message": "Invalid email or password"
        }

    return {
        "message": "Admin login successful",
        "admin_id": admin.admin_id,
        "name": admin.name
    }
@router.get("/admins/{admin_id}")
def get_admin(
    admin_id: int,
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(
        Admin.admin_id == admin_id
    ).first()

    if admin is None:
        return {
            "message": "Admin not found"
        }

    return {
        "admin_id": admin.admin_id,
        "name": admin.name,
        "email": admin.email
    }
@router.put("/admins/{admin_id}")
def update_admin(
    admin_id: int,
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(
        Admin.admin_id == admin_id
    ).first()

    if admin is None:
        return {
            "message": "Admin not found"
        }

    admin.name = name
    admin.email = email
    admin.password = password

    db.commit()
    db.refresh(admin)

    return {
        "message": "Admin updated successfully",
        "admin_id": admin.admin_id
    }
@router.delete("/admins/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(
        Admin.admin_id == admin_id
    ).first()

    if admin is None:
        return {
            "message": "Admin not found"
        }

    db.delete(admin)
    db.commit()

    return {
        "message": "Admin deleted successfully"
    }
# =====================================================
# ADMIN FORGOT PASSWORD
# =====================================================

@router.post("/admins/forgot-password")
def admin_forgot_password(
    email: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(
        Admin.email == email
    ).first()

    if admin is None:
        return {
            "message": "Email not found"
        }

    admin.password = new_password

    db.commit()

    return {
        "message": "Password reset successfully"
    }