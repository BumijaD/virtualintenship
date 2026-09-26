from sqlalchemy import Column, Integer, String, DECIMAL, Text
from ..database import Base


class Student(Base):

    __tablename__ = "student"

    student_id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    phone = Column(String(15))

    department = Column(String(100))

    cgpa = Column(DECIMAL(3, 2))

    college = Column(String(150))

    year_of_study = Column(String(50))

    skills = Column(Text)

    resume = Column(String(255))