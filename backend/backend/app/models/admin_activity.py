from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from ..database import Base


class AdminActivity(Base):
    __tablename__ = "admin_activity"

    activity_id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, nullable=False)
    activity = Column(String(255), nullable=False)
    activity_date = Column(DateTime, default=datetime.now)