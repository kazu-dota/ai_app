import pytest
from fastapi.testclient import TestClient


def test_fastapi_app_startup():
    """FastAPIアプリケーションが正常に起動することを確認"""
    from app.main import app
    
    client = TestClient(app)
    
    # アプリケーションが作成されていることを確認
    assert app is not None
    assert hasattr(app, 'title')


def test_health_check_endpoint():
    """ヘルスチェックエンドポイントが200を返すことを確認"""
    from app.main import app
    
    client = TestClient(app)
    response = client.get("/health")
    
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_cors_headers():
    """CORS設定が正常に動作することを確認"""
    from app.main import app
    
    client = TestClient(app)
    response = client.options("/health", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    
    # CORS プリフライトレスポンスの確認
    assert response.status_code == 200