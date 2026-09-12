from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import create_access_token, verify_password, get_password_hash
from app.db.session import get_db
from FLEX.backend.app.models.user import User
from app.schemas.user import UserCreate, EmailRequest, UsernameRequest,PasswordRequest, MessageResponse, Token
from app.config.settings import get_settings
import re

router = APIRouter()

settings = get_settings()

# JWT Configuration
JWT_SECRET_KEY = settings.SECRET_KEY
JWT_ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# Password hashing configuration
PWD_CONTEXT_SCHEMES = ["bcrypt"]
PWD_DEPRECATED = "auto"

# Token types
TOKEN_TYPE_ACCESS = "access"
TOKEN_TYPE_REFRESH = "refresh"

# Security headers
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
}

@router.post("/login", response_model=Token)
async def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/checkEmail", response_model=MessageResponse)
async def checkEmail(email_req: EmailRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == email_req.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return {"message": "email is available"}
    
@router.post("/checkUsername", response_model=MessageResponse)
async def checkUsername(username_req: UsernameRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == username_req.username).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )
    return {"message": "username is available"}

@router.post("/checkPassword", response_model=MessageResponse)
async def checkPassword(password_req: PasswordRequest, db: Session = Depends(get_db)):
    password_pattern = r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    if not re.match(password_pattern, password_req.password):
        raise HTTPException(
            status_code=400,
            detail="Password does not meet the required criteria. It must contain at least one uppercase letter, one digit, and one special character (@$!%*?&) and be at least 8 characters long."
        )
    
    return {"message": "password is valid"}

@router.post("/register", response_model=MessageResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    secured_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=secured_password,  # Password hashing should be done in the model
        postcode=user.postcode,
        address=user.address,
        DOB=user.DOB,
        fullname=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user 
