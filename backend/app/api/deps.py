"""
FastAPI Route Dependencies (Database session & User authentication).
"""

from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from backend.app.core.security import decode_access_token
from backend.app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def get_current_user_optional(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[User]:
    """Retrieves current user if token provided, otherwise returns demo default user or None."""
    if not token:
        # Fallback to guest demo user (or return None)
        demo_user = db.query(User).filter(User.email == "demo@datapilot.ai").first()
        if not demo_user:
            demo_user = User(
                email="demo@datapilot.ai",
                full_name="Demo Analyst",
                hashed_password="demo_hashed_password",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
        return demo_user

    user_id = decode_access_token(token)
    if not user_id:
        demo_user = db.query(User).filter(User.email == "demo@datapilot.ai").first()
        return demo_user

    user = db.query(User).filter(User.id == int(user_id)).first()
    return user


def get_current_user(
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user
