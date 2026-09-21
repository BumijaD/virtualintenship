from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.internship import Internship

router = APIRouter()


# Get all internships
@router.get("/internships")
def get_all_internships(
    db: Session = Depends(get_db)
):
    internships = db.query(Internship).all()

    return [
        {
            "internship_id": internship.internship_id,
            "company_id": internship.company_id,
            "admin_id": internship.admin_id,
            "title": internship.title,
            "description": internship.description,
            "location": internship.location,
            "stipend": internship.stipend,
            "duration": internship.duration,
            "last_date": str(internship.last_date)
        }
        for internship in internships
    ]


# Create internship
@router.post("/internships")
def create_internship(
    company_id: int,
    admin_id: int,
    title: str,
    description: str,
    location: str,
    stipend: float,
    duration: str,
    last_date: str,
    db: Session = Depends(get_db)
):
    internship = Internship(
        company_id=company_id,
        admin_id=admin_id,
        title=title,
        description=description,
        location=location,
        stipend=stipend,
        duration=duration,
        last_date=last_date
    )

    db.add(internship)
    db.commit()
    db.refresh(internship)

    return {
        "message": "Internship created successfully",
        "internship_id": internship.internship_id
    }


# Get one internship
@router.get("/internships/{internship_id}")
def get_internship(
    internship_id: int,
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(
        Internship.internship_id == internship_id
    ).first()

    if internship is None:
        return {
            "message": "Internship not found"
        }

    return {
        "internship_id": internship.internship_id,
        "company_id": internship.company_id,
        "admin_id": internship.admin_id,
        "title": internship.title,
        "description": internship.description,
        "location": internship.location,
        "stipend": internship.stipend,
        "duration": internship.duration,
        "last_date": str(internship.last_date)
    }


# Update internship
@router.put("/internships/{internship_id}")
def update_internship(
    internship_id: int,
    company_id: int,
    admin_id: int,
    title: str,
    description: str,
    location: str,
    stipend: float,
    duration: str,
    last_date: str,
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(
        Internship.internship_id == internship_id
    ).first()

    if internship is None:
        return {
            "message": "Internship not found"
        }

    internship.company_id = company_id
    internship.admin_id = admin_id
    internship.title = title
    internship.description = description
    internship.location = location
    internship.stipend = stipend
    internship.duration = duration
    internship.last_date = last_date

    db.commit()
    db.refresh(internship)

    return {
        "message": "Internship updated successfully",
        "internship_id": internship.internship_id
    }


# Delete internship
@router.delete("/internships/{internship_id}")
def delete_internship(
    internship_id: int,
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(
        Internship.internship_id == internship_id
    ).first()

    if internship is None:
        return {
            "message": "Internship not found"
        }

    db.delete(internship)
    db.commit()

    return {
        "message": "Internship deleted successfully"
    }