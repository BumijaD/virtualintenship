from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.admin_activity import AdminActivity

router = APIRouter()


@router.post("/admin-activities")
def create_activity(
    admin_id: int,
    activity: str,
    db: Session = Depends(get_db)
):
    new_activity = AdminActivity(
        admin_id=admin_id,
        activity=activity
    )

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    return {
        "message": "Admin activity recorded successfully",
        "activity_id": new_activity.activity_id
    }
@router.get("/admin-activities/{activity_id}")
def get_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    activity = db.query(AdminActivity).filter(
        AdminActivity.activity_id == activity_id
    ).first()

    if activity is None:
        return {
            "message": "Activity not found"
        }

    return {
        "activity_id": activity.activity_id,
        "admin_id": activity.admin_id,
        "activity": activity.activity,
        "activity_date": str(activity.activity_date)
    }
@router.put("/admin-activities/{activity_id}")
def update_activity(
    activity_id: int,
    activity: str,
    db: Session = Depends(get_db)
):
    activity_record = db.query(AdminActivity).filter(
        AdminActivity.activity_id == activity_id
    ).first()

    if activity_record is None:
        return {
            "message": "Activity not found"
        }

    activity_record.activity = activity

    db.commit()
    db.refresh(activity_record)

    return {
        "message": "Admin activity updated successfully",
        "activity_id": activity_record.activity_id,
        "activity": activity_record.activity
    }
@router.delete("/admin-activities/{activity_id}")
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    activity_record = db.query(AdminActivity).filter(
        AdminActivity.activity_id == activity_id
    ).first()

    if activity_record is None:
        return {
            "message": "Activity not found"
        }

    db.delete(activity_record)
    db.commit()

    return {
        "message": "Admin activity deleted successfully"
    }