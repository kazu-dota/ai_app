from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, CheckConstraint, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    """ユーザーモデル"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    department = Column(String(100))
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # チェック制約
    __table_args__ = (
        CheckConstraint("role IN ('user', 'admin')", name="check_user_role"),
    )
    
    # リレーション
    created_apps = relationship("App", foreign_keys="App.creator_id", back_populates="creator")
    favorites = relationship("Favorite", back_populates="user")
    ratings = relationship("Rating", back_populates="user")


class Category(Base):
    """カテゴリモデル"""
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    color = Column(String(7), default="#3B82F6")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # リレーション
    apps = relationship("App", back_populates="category")


class App(Base):
    """アプリケーションモデル"""
    __tablename__ = "apps"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    creator_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="active", nullable=False)
    url = Column(Text)
    usage_guide = Column(Text)
    input_example = Column(Text)
    output_example = Column(Text)
    usage_count = Column(Integer, default=0)
    avg_rating = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # チェック制約
    __table_args__ = (
        CheckConstraint("status IN ('active', 'development', 'maintenance')", name="check_app_status"),
    )
    
    # リレーション
    category = relationship("Category", back_populates="apps")
    creator = relationship("User", foreign_keys=[creator_id], back_populates="created_apps")
    favorites = relationship("Favorite", back_populates="app")
    ratings = relationship("Rating", back_populates="app")


class Favorite(Base):
    """お気に入りモデル"""
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    app_id = Column(Integer, ForeignKey("apps.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # ユニーク制約
    __table_args__ = (
        CheckConstraint("user_id IS NOT NULL AND app_id IS NOT NULL", name="check_favorite_not_null"),
    )
    
    # リレーション
    user = relationship("User", back_populates="favorites")
    app = relationship("App", back_populates="favorites")


class Rating(Base):
    """評価モデル"""
    __tablename__ = "ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    app_id = Column(Integer, ForeignKey("apps.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # チェック制約
    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating_range"),
    )
    
    # リレーション
    app = relationship("App", back_populates="ratings")
    user = relationship("User", back_populates="ratings")