from sqlalchemy import Column, Integer, String, Date
from ..database import Base


class Application(Base):
    __tablename__ = "application"

    application_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    internship_id = Column(Integer, nullable=False)
    application_date = Column(Date)
    status = Column(String(30), default="Applied")