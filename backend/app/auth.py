import hashlib
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from jose import JWTError, jwt

SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def _truncate_password_for_bcrypt(password: str) -> bytes:
    pwd_bytes = password.encode()
    if len(pwd_bytes) <= 72:
        return pwd_bytes
    return hashlib.sha256(pwd_bytes).digest()


def hash_password(password: str) -> str:
    processed_pwd = _truncate_password_for_bcrypt(password)
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(processed_pwd, salt)
    return hashed.decode()


def verify_password(password: str, hashed: str) -> bool:
    processed_pwd = _truncate_password_for_bcrypt(password)
    return bcrypt.checkpw(processed_pwd, hashed.encode())


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
