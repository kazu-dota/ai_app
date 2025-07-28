from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, categories, apps

app = FastAPI(
    title="AI App Catalog",
    version="1.0.0",
    description="社内AIアプリケーションのカタログ・管理システム"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターを追加
app.include_router(auth.router, prefix="/api/auth", tags=["認証"])
app.include_router(categories.router, prefix="/api/categories", tags=["カテゴリ"])
app.include_router(apps.router, prefix="/api/apps", tags=["アプリ"])


@app.get("/health")
def health_check():
    """ヘルスチェックエンドポイント"""
    return {"status": "healthy"}


@app.get("/")
def root():
    """ルートエンドポイント"""
    return {"message": "AI App Catalog API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)