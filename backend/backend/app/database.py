import os
from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# Railway MySQL settings
MYSQLHOST = os.getenv("MYSQLHOST")
MYSQLPORT = os.getenv("MYSQLPORT")
MYSQLUSER = os.getenv("MYSQLUSER")
MYSQLPASSWORD = os.getenv("MYSQLPASSWORD")
MYSQLDATABASE = os.getenv("MYSQLDATABASE")


if MYSQLHOST:
    DATABASE_URL = (
        f"mysql+pymysql://{MYSQLUSER}:"
        f"{quote_plus(MYSQLPASSWORD)}@"
        f"{MYSQLHOST}:{MYSQLPORT}/{MYSQLDATABASE}"
    )
else:
    # Local development
    DATABASE_URL = "mysql+pymysql://root:0000@localhost:3306/virtual_internship_db"


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()