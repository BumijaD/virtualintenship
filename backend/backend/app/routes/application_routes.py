from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from ..database import get_db
from ..models.application import Application

router = APIRouter()


# CREATE APPLICATION
@router.post("/applications")
def create_application(
    student_id: int,
    internship_id: int,
    db: Session = Depends(get_db)
):
    application = Application(
        student_id=student_id,
        internship_id=internship_id,
        application_date=date.today()
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "message": "Application submitted successfully",
        "application_id": application.application_id,
        "student_id": application.student_id,
        "internship_id": application.internship_id,
        "application_date": str(application.application_date),
        "status": application.status
    }


# GET ALL APPLICATIONS
@router.get("/applications")
def get_all_applications(
    db: Session = Depends(get_db)
):
    applications = db.query(Application).all()

    result = []

    for application in applications:
        result.append({
            "application_id": application.application_id,
            "student_id": application.student_id,
            "internship_id": application.internship_id,
            "application_date": str(application.application_date),
            "status": application.status
        })

    return result


# GET APPLICATIONS FOR ONE STUDENT
@router.get("/applications/student/{student_id}")
def get_student_applications(
    student_id: int,
    db: Session = Depends(get_db)
):
    applications = db.query(Application).filter(
        Application.student_id == student_id
    ).all()

    result = []

    for application in applications:
        result.append({
            "application_id": application.application_id,
            "student_id": application.student_id,
            "internship_id": application.internship_id,
            "application_date": str(application.application_date),
            "status": application.status
        })

    return result


# GET ONE APPLICATION
@router.get("/applications/{application_id}")
def get_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.application_id == application_id
    ).first()

    if application is None:
        return {
            "message": "Application not found"
        }

    return {
        "application_id": application.application_id,
        "student_id": application.student_id,
        "internship_id": application.internship_id,
        "application_date": str(application.application_date),
        "status": application.status
    }


# UPDATE APPLICATION STATUS
@router.put("/applications/{application_id}")
def update_application(
    application_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.application_id == application_id
    ).first()

    if application is None:
        return {
            "message": "Application not found"
        }

    application.status = status

    db.commit()
    db.refresh(application)

    return {
        "message": "Application status updated successfully",
        "application_id": application.application_id,
        "status": application.status
    }


# DELETE APPLICATION
@router.delete("/applications/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.application_id == application_id
    ).first()

    if application is None:
        return {
            "message": "Application not found"
        }

    db.delete(application)
    db.commit()

    return {
        "message": "Application deleted successfully"
    }