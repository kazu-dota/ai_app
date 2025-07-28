from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# データベースURL（環境変数から取得、デフォルトはSQLite）
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# SQLiteの場合のみcheck_same_threadをFalseに設定
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """データベースセッションを取得"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """全テーブルを作成"""
    Base.metadata.create_all(bind=engine)