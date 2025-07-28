import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.models import User, Category, App
from app.auth import get_password_hash


@pytest.fixture
def test_db():
    """テスト用データベースセッション"""
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test_apps.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    Base.metadata.create_all(bind=engine)
    
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    yield TestingSessionLocal()
    
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def client():
    """テスト用クライアント"""
    return TestClient(app)


@pytest.fixture
def test_user_and_admin(test_db):
    """テスト用ユーザーと管理者を作成"""
    # 一般ユーザー
    user = User(
        email="user@example.com",
        name="一般ユーザー",
        password_hash=get_password_hash("userpass"),
        role="user"
    )
    test_db.add(user)
    
    # 管理者ユーザー
    admin = User(
        email="admin@example.com", 
        name="管理者",
        password_hash=get_password_hash("adminpass"),
        role="admin"
    )
    test_db.add(admin)
    test_db.commit()
    test_db.refresh(user)
    test_db.refresh(admin)
    
    return {"user": user, "admin": admin}


def get_auth_headers(client, email, password):
    """認証トークンを取得してヘッダーを返す"""
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_category_as_admin(client, test_db, test_user_and_admin):
    """管理者がカテゴリを作成できることを確認"""
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpass")
    
    response = client.post(
        "/api/categories",
        json={
            "name": "チャットボット",
            "description": "対話型AIアプリケーション",
            "color": "#3B82F6"
        },
        headers=admin_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "チャットボット"
    assert data["description"] == "対話型AIアプリケーション"
    assert data["color"] == "#3B82F6"


def test_create_category_as_user_fails(client, test_db, test_user_and_admin):
    """一般ユーザーがカテゴリ作成に失敗することを確認"""
    user_headers = get_auth_headers(client, "user@example.com", "userpass")
    
    response = client.post(
        "/api/categories",
        json={"name": "テストカテゴリ", "color": "#FF0000"},
        headers=user_headers
    )
    
    assert response.status_code == 403


def test_get_categories(client, test_db, test_user_and_admin):
    """カテゴリ一覧取得が動作することを確認"""
    user_headers = get_auth_headers(client, "user@example.com", "userpass")
    
    # カテゴリを事前に作成
    category = Category(name="テストカテゴリ", description="説明", color="#00FF00")
    test_db.add(category)
    test_db.commit()
    
    response = client.get("/api/categories", headers=user_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "テストカテゴリ"


def test_create_app_as_admin(client, test_db, test_user_and_admin):
    """管理者がアプリを作成できることを確認"""
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpass")
    admin = test_user_and_admin["admin"]
    
    # カテゴリを事前に作成
    category = Category(name="AIアシスタント", color="#3B82F6")
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    response = client.post(
        "/api/apps",
        json={
            "name": "ChatBot Pro",
            "description": "高性能なチャットボットアプリケーション",
            "category_id": category.id,
            "url": "https://chatbot.example.com",
            "usage_guide": "質問を入力してください",
            "input_example": "こんにちは",
            "output_example": "こんにちは！何かお手伝いできることはありますか？"
        },
        headers=admin_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "ChatBot Pro"
    assert data["description"] == "高性能なチャットボットアプリケーション"
    assert data["category_id"] == category.id
    assert data["creator_id"] == admin.id
    assert data["status"] == "active"


def test_get_apps_list(client, test_db, test_user_and_admin):
    """アプリ一覧取得が動作することを確認"""
    user_headers = get_auth_headers(client, "user@example.com", "userpass")
    user = test_user_and_admin["user"]
    
    # テストデータを作成
    category = Category(name="テストカテゴリ", color="#FF0000")
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    app1 = App(
        name="アプリ1",
        description="説明1",
        category_id=category.id,
        creator_id=user.id,
        status="active"
    )
    app2 = App(
        name="アプリ2", 
        description="説明2",
        category_id=category.id,
        creator_id=user.id,
        status="active"
    )
    test_db.add_all([app1, app2])
    test_db.commit()
    
    response = client.get("/api/apps", headers=user_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2


def test_get_app_detail(client, test_db, test_user_and_admin):
    """アプリ詳細取得が動作することを確認"""
    user_headers = get_auth_headers(client, "user@example.com", "userpass")
    user = test_user_and_admin["user"]
    
    # テストアプリを作成
    category = Category(name="詳細テストカテゴリ", color="#0000FF")
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    app = App(
        name="詳細テストアプリ",
        description="詳細テスト用の説明",
        category_id=category.id,
        creator_id=user.id,
        url="https://test.example.com",
        usage_guide="使い方テスト"
    )
    test_db.add(app)
    test_db.commit()
    test_db.refresh(app)
    
    response = client.get(f"/api/apps/{app.id}", headers=user_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "詳細テストアプリ"
    assert data["description"] == "詳細テスト用の説明"
    assert data["url"] == "https://test.example.com"


def test_search_apps(client, test_db, test_user_and_admin):
    """アプリ検索が動作することを確認"""
    user_headers = get_auth_headers(client, "user@example.com", "userpass")
    user = test_user_and_admin["user"]
    
    # テストデータを作成
    category = Category(name="検索テストカテゴリ", color="#FF0000")
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    # 検索対象のアプリ
    app1 = App(
        name="Python コードレビューAI",
        description="Pythonコードを自動的にレビューします",
        category_id=category.id,
        creator_id=user.id
    )
    # 検索対象外のアプリ
    app2 = App(
        name="データ分析ツール",
        description="CSVファイルを分析します",
        category_id=category.id,
        creator_id=user.id
    )
    test_db.add_all([app1, app2])
    test_db.commit()
    
    # "Python"で検索
    response = client.get("/api/apps?search=Python", headers=user_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(app["name"] == "Python コードレビューAI" for app in data)


def test_increment_app_usage(client, test_db, test_user_and_admin):
    """アプリの利用カウントが増加することを確認"""
    user_headers = get_auth_headers(client, "user@example.com", "userpass")
    user = test_user_and_admin["user"]
    
    # テストアプリを作成
    category = Category(name="利用カウントテスト", color="#00FF00")
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    
    app = App(
        name="利用カウントテストアプリ",
        description="利用回数をカウントするテスト",
        category_id=category.id,
        creator_id=user.id,
        usage_count=0
    )
    test_db.add(app)
    test_db.commit()
    test_db.refresh(app)
    
    # 利用カウントを増加
    response = client.post(f"/api/apps/{app.id}/use", headers=user_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["usage_count"] == 1