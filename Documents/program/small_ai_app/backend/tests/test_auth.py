import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.models import User
from app.auth import create_access_token, verify_password, get_password_hash, verify_token


@pytest.fixture
def test_db():
    """テスト用データベースセッション"""
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"
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


def test_password_hashing():
    """パスワードのハッシュ化・検証が動作することを確認"""
    password = "testpassword123"
    hashed = get_password_hash(password)
    
    # ハッシュ化されたパスワードは元のパスワードと異なる
    assert hashed != password
    
    # パスワード検証が正常に動作する
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False


def test_jwt_token_creation_and_verification():
    """JWTトークンの生成・検証が動作することを確認"""
    user_data = {"sub": "test@example.com", "role": "user"}
    token = create_access_token(data=user_data)
    
    # トークンが生成される
    assert token is not None
    assert isinstance(token, str)
    
    # トークンの検証が正常に動作する
    payload = verify_token(token)
    assert payload["sub"] == "test@example.com"
    assert payload["role"] == "user"


def test_login_endpoint_success(client, test_db):
    """ログインエンドポイントが正常に動作することを確認"""
    # テストユーザーを作成
    password_hash = get_password_hash("testpass")
    user = User(
        email="test@example.com",
        name="テストユーザー",
        password_hash=password_hash,
        role="user"
    )
    test_db.add(user)
    test_db.commit()
    
    # ログインを試行
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "testpass"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data


def test_login_endpoint_invalid_credentials(client, test_db):
    """無効な認証情報でのログインが失敗することを確認"""
    response = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpass"}
    )
    
    assert response.status_code == 401
    assert "detail" in response.json()


def test_protected_endpoint_without_token(client, test_db):
    """認証が必要なエンドポイントがトークンなしでアクセス拒否されることを確認"""
    response = client.get("/api/auth/me")
    
    assert response.status_code == 401


def test_protected_endpoint_with_valid_token(client, test_db):
    """有効なトークンで認証が必要なエンドポイントにアクセスできることを確認"""
    # テストユーザーを作成
    password_hash = get_password_hash("testpass")
    user = User(
        email="auth@example.com",
        name="認証テストユーザー",
        password_hash=password_hash,
        role="user"
    )
    test_db.add(user)
    test_db.commit()
    
    # トークンを取得
    login_response = client.post(
        "/api/auth/login",
        json={"email": "auth@example.com", "password": "testpass"}
    )
    token = login_response.json()["access_token"]
    
    # 認証が必要なエンドポイントにアクセス
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "auth@example.com"
    assert data["name"] == "認証テストユーザー"


def test_user_registration_by_admin(client, test_db):
    """管理者によるユーザー登録が動作することを確認"""
    # 管理者を作成
    admin_password_hash = get_password_hash("adminpass")
    admin = User(
        email="admin@example.com",
        name="管理者",
        password_hash=admin_password_hash,
        role="admin"
    )
    test_db.add(admin)
    test_db.commit()
    
    # 管理者としてログイン
    login_response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "adminpass"}
    )
    admin_token = login_response.json()["access_token"]
    
    # 新しいユーザーを登録
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "name": "新規ユーザー",
            "department": "営業部",
            "password": "newuserpass",
            "role": "user"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["name"] == "新規ユーザー"
    assert data["role"] == "user"


def test_user_registration_by_regular_user_fails(client, test_db):
    """一般ユーザーによるユーザー登録が失敗することを確認"""
    # 一般ユーザーを作成
    user_password_hash = get_password_hash("userpass")
    user = User(
        email="user@example.com",
        name="一般ユーザー",
        password_hash=user_password_hash,
        role="user"
    )
    test_db.add(user)
    test_db.commit()
    
    # 一般ユーザーとしてログイン
    login_response = client.post(
        "/api/auth/login",
        json={"email": "user@example.com", "password": "userpass"}
    )
    user_token = login_response.json()["access_token"]
    
    # ユーザー登録を試行（失敗するはず）
    response = client.post(
        "/api/auth/register",
        json={
            "email": "unauthorized@example.com",
            "name": "未認可ユーザー",
            "password": "password"
        },
        headers={"Authorization": f"Bearer {user_token}"}
    )
    
    assert response.status_code == 403