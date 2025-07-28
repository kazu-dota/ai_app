from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


class UserLogin(BaseModel):
    """ユーザーログインスキーマ"""
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    """ユーザー作成スキーマ"""
    email: EmailStr
    name: str
    department: Optional[str] = None
    password: str
    role: str = "user"


class UserResponse(BaseModel):
    """ユーザー情報レスポンススキーマ"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: str
    name: str
    department: Optional[str] = None
    role: str
    created_at: datetime


class Token(BaseModel):
    """トークンレスポンススキーマ"""
    access_token: str
    token_type: str
    user: UserResponse


# カテゴリスキーマ
class CategoryCreate(BaseModel):
    """カテゴリ作成スキーマ"""
    name: str
    description: Optional[str] = None
    color: str = "#3B82F6"


class CategoryResponse(BaseModel):
    """カテゴリレスポンススキーマ"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    description: Optional[str] = None
    color: str
    created_at: datetime


# アプリスキーマ
class AppCreate(BaseModel):
    """アプリ作成スキーマ"""
    name: str
    description: str
    category_id: int
    url: Optional[str] = None
    usage_guide: Optional[str] = None
    input_example: Optional[str] = None
    output_example: Optional[str] = None


class AppUpdate(BaseModel):
    """アプリ更新スキーマ"""
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    status: Optional[str] = None
    url: Optional[str] = None
    usage_guide: Optional[str] = None
    input_example: Optional[str] = None
    output_example: Optional[str] = None


class AppResponse(BaseModel):
    """アプリレスポンススキーマ"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    description: str
    category_id: Optional[int] = None
    creator_id: Optional[int] = None
    status: str
    url: Optional[str] = None
    usage_guide: Optional[str] = None
    input_example: Optional[str] = None
    output_example: Optional[str] = None
    usage_count: int
    avg_rating: float
    created_at: datetime
    updated_at: datetime


class AppListResponse(BaseModel):
    """アプリ一覧レスポンススキーマ（関連情報含む）"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    description: str
    category: Optional[CategoryResponse] = None
    creator: Optional[UserResponse] = None
    status: str
    url: Optional[str] = None
    usage_count: int
    avg_rating: float
    created_at: datetime