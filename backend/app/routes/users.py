from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.crud import authenticate_user, create_user, get_user_by_username, get_user_by_email, update_user, delete_user
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas.user import UserCreate, UserUpdate, UserLogin, UserResponse

router = APIRouter()


@router.get("/check-username/{username}")
async def check_username(username: str, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_username(db, username)
    return {"available": user is None}


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    if await get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed. Please try with different credentials.",
        )
    if await get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed. Please try with different credentials.",
        )
    return await create_user(db, user)


@router.post("/login")
async def login(user_login: UserLogin, response: Response, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, user_login.username, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token = create_access_token(data={"sub": user.username})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return {"message": "Login successful"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, secure=True, samesite="none")
    return {"message": "Logged out"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if data.username and data.username != current_user.username:
        if await get_user_by_username(db, data.username):
            raise HTTPException(status_code=400, detail="Username already taken")
    if data.email and data.email != current_user.email:
        if await get_user_by_email(db, data.email):
            raise HTTPException(status_code=400, detail="Email already taken")
    return await update_user(db, current_user, data)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await delete_user(db, current_user)
