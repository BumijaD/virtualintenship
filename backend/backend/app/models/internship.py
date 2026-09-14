from sqlalchemy import Column, Integer, String, Text, DECIMAL, Date
from ..database import Base


class Internship(Base):
    __tablename__ = "internship"

    internship_id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, nullable=False)
    admin_id = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text)
    location = Column(String(100))
    stipend = Column(DECIMAL(10, 2))
    duration = Column(String(50))
    last_date = Column(Date)