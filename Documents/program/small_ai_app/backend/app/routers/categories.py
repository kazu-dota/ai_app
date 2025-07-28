from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Category, User
from app.schemas import CategoryCreate, CategoryResponse
from app.auth import get_current_user, get_current_admin_user

router = APIRouter()


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """カテゴリを作成（管理者のみ）"""
    # カテゴリ名の重複チェック
    db_category = db.query(Category).filter(Category.name == category_data.name).first()
    if db_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このカテゴリ名は既に存在します"
        )
    
    # 新しいカテゴリを作成
    db_category = Category(
        name=category_data.name,
        description=category_data.description,
        color=category_data.color
    )
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return CategoryResponse.model_validate(db_category)


@router.get("/", response_model=List[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """カテゴリ一覧を取得"""
    categories = db.query(Category).order_by(Category.name).all()
    return [CategoryResponse.model_validate(category) for category in categories]