import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.models import User, Category, App, Favorite, Rating


@pytest.fixture
def test_db():
    """テスト用データベースセッションを作成"""
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_user_model_creation(test_db):
    """Userモデルが正しく作成されることを確認"""
    user = User(
        email="test@example.com",
        name="テストユーザー",
        department="開発部",
        password_hash="hashedpassword",
        role="user"
    )
    
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    assert user.id is not None
    assert user.email == "test@example.com"
    assert user.name == "テストユーザー"
    assert user.department == "開発部"
    assert user.role == "user"
    assert user.created_at is not None


def test_category_model_creation(test_db):
    """Categoryモデルが正しく作成されることを確認"""
    category = Category(
        name="チャットボット",
        description="対話型AIアプリケーション",
        color="#3B82F6"
    )
    
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    assert category.id is not None
    assert category.name == "チャットボット"
    assert category.description == "対話型AIアプリケーション"
    assert category.color == "#3B82F6"


def test_app_model_with_relationships(test_db):
    """Appモデルと関連付けが正しく動作することを確認"""
    # ユーザーとカテゴリを先に作成
    user = User(
        email="creator@example.com",
        name="作成者",
        password_hash="hash",
        role="admin"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    category = Category(name="テストカテゴリ", color="#FF0000")
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    # アプリを作成
    app = App(
        name="テストアプリ",
        description="テスト用のアプリケーション",
        category_id=category.id,
        creator_id=user.id,
        status="active",
        url="https://test.example.com"
    )
    
    test_db.add(app)
    test_db.commit()
    test_db.refresh(app)
    
    assert app.id is not None
    assert app.name == "テストアプリ"
    assert app.category_id == category.id
    assert app.creator_id == user.id
    assert app.status == "active"


def test_favorite_model_creation(test_db):
    """Favoriteモデルが正しく作成されることを確認"""
    # 前提条件の作成
    user = User(email="user@example.com", name="ユーザー", password_hash="hash")
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    category = Category(name="カテゴリ", color="#00FF00")
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    app = App(name="アプリ", description="説明", category_id=category.id, creator_id=user.id)
    test_db.add(app)
    test_db.commit()
    test_db.refresh(app)
    
    # お気に入りを作成
    favorite = Favorite(user_id=user.id, app_id=app.id)
    test_db.add(favorite)
    test_db.commit()
    test_db.refresh(favorite)
    
    assert favorite.id is not None
    assert favorite.user_id == user.id
    assert favorite.app_id == app.id


def test_rating_model_creation(test_db):
    """Ratingモデルが正しく作成されることを確認"""
    # 前提条件の作成
    user = User(email="rater@example.com", name="評価者", password_hash="hash")
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    category = Category(name="カテゴリ", color="#0000FF")
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    app = App(name="評価対象アプリ", description="説明", category_id=category.id, creator_id=user.id)
    test_db.add(app)
    test_db.commit()
    test_db.refresh(app)
    
    # 評価を作成
    rating = Rating(app_id=app.id, user_id=user.id, rating=5)
    test_db.add(rating)
    test_db.commit()
    test_db.refresh(rating)
    
    assert rating.id is not None
    assert rating.app_id == app.id
    assert rating.user_id == user.id
    assert rating.rating == 5