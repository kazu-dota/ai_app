from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_
from app.database import get_db
from app.models import App, Category, User
from app.schemas import AppCreate, AppUpdate, AppResponse, AppListResponse, CategoryResponse, UserResponse
from app.auth import get_current_user, get_current_admin_user

router = APIRouter()


@router.post("/", response_model=AppResponse, status_code=status.HTTP_201_CREATED)
def create_app(
    app_data: AppCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """アプリを作成（管理者のみ）"""
    # カテゴリの存在確認
    category = db.query(Category).filter(Category.id == app_data.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="指定されたカテゴリが存在しません"
        )
    
    # 新しいアプリを作成
    db_app = App(
        name=app_data.name,
        description=app_data.description,
        category_id=app_data.category_id,
        creator_id=current_admin.id,
        url=app_data.url,
        usage_guide=app_data.usage_guide,
        input_example=app_data.input_example,
        output_example=app_data.output_example
    )
    
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    
    return AppResponse.model_validate(db_app)


@router.get("/", response_model=List[AppListResponse])
def get_apps(
    search: Optional[str] = Query(None, description="検索キーワード"),
    category_id: Optional[int] = Query(None, description="カテゴリID"),
    status: Optional[str] = Query(None, description="ステータス"),
    page: int = Query(1, ge=1, description="ページ番号"),
    per_page: int = Query(20, ge=1, le=100, description="1ページあたりの件数"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """アプリ一覧を取得（検索・フィルタ機能付き）"""
    query = db.query(App).options(
        selectinload(App.category),
        selectinload(App.creator)
    )
    
    # 検索条件を適用
    if search:
        search_filter = or_(
            App.name.contains(search),
            App.description.contains(search)
        )
        query = query.filter(search_filter)
    
    if category_id:
        query = query.filter(App.category_id == category_id)
    
    if status:
        query = query.filter(App.status == status)
    
    # ページネーション
    offset = (page - 1) * per_page
    apps = query.order_by(App.created_at.desc()).offset(offset).limit(per_page).all()
    
    # レスポンス形式に変換
    result = []
    for app in apps:
        app_dict = AppListResponse.model_validate(app).model_dump()
        
        # 関連データを追加
        if app.category:
            app_dict["category"] = CategoryResponse.model_validate(app.category)
        if app.creator:
            app_dict["creator"] = UserResponse.model_validate(app.creator)
        
        result.append(app_dict)
    
    return result


@router.get("/{app_id}", response_model=AppResponse)
def get_app(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """アプリ詳細を取得"""
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="アプリが見つかりません"
        )
    
    return AppResponse.model_validate(app)


@router.put("/{app_id}", response_model=AppResponse)
def update_app(
    app_id: int,
    app_data: AppUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """アプリを更新（作成者・管理者のみ）"""
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="アプリが見つかりません"
        )
    
    # 権限チェック（作成者または管理者のみ）
    if app.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="このアプリを更新する権限がありません"
        )
    
    # カテゴリIDが指定されている場合は存在確認
    if app_data.category_id:
        category = db.query(Category).filter(Category.id == app_data.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="指定されたカテゴリが存在しません"
            )
    
    # フィールドを更新
    update_data = app_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(app, field, value)
    
    db.commit()
    db.refresh(app)
    
    return AppResponse.model_validate(app)


@router.delete("/{app_id}")
def delete_app(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """アプリを削除（作成者・管理者のみ）"""
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="アプリが見つかりません"
        )
    
    # 権限チェック（作成者または管理者のみ）
    if app.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="このアプリを削除する権限がありません"
        )
    
    db.delete(app)
    db.commit()
    
    return {"message": "アプリが削除されました"}


@router.post("/{app_id}/use", response_model=AppResponse)
def increment_app_usage(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """アプリの利用カウントを増加"""
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="アプリが見つかりません"
        )
    
    app.usage_count += 1
    db.commit()
    db.refresh(app)
    
    return AppResponse.model_validate(app)