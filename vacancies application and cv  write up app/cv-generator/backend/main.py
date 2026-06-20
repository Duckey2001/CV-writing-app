from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
import os
from pathlib import Path
import json
import hashlib
from datetime import datetime, timedelta
import jwt

app = FastAPI(title="CV Generator API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create users directory
USERS_DIR = Path("users")
USERS_DIR.mkdir(exist_ok=True)

# JWT Configuration
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

security = HTTPBearer()

class CVData(BaseModel):
    name: str
    email: str
    phone: str
    summary: Optional[str] = ""
    experience: List[dict] = []
    education: List[dict] = []
    skills: List[str] = []
    job_description: Optional[str] = ""

class MotivationLetterRequest(BaseModel):
    cv_data: CVData
    job_description: str
    company_name: str
    style: Optional[str] = "professional"

class JobMatchRequest(BaseModel):
    cv_data: CVData
    job_description: str

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    username: str
    email: str

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_user_file(username: str) -> Path:
    return USERS_DIR / f"{username}.json"

def user_exists(username: str) -> bool:
    return get_user_file(username).exists()

def save_user(user: dict):
    user_file = get_user_file(user["username"])
    with user_file.open("w") as f:
        json.dump(user, f)

def load_user(username: str) -> Optional[dict]:
    user_file = get_user_file(username)
    if user_file.exists():
        with user_file.open("r") as f:
            return json.load(f)
    return None

# Authentication endpoints
@app.post("/api/auth/register")
async def register(user_data: UserRegister):
    """Register a new user"""
    if user_exists(user_data.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user = {
        "username": user_data.username,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "created_at": datetime.utcnow().isoformat()
    }
    
    save_user(user)
    return {"success": True, "message": "User registered successfully"}

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    """Login user and return access token"""
    user = load_user(user_data.username)
    
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"username": user["username"], "email": user["email"]}
    }

@app.get("/api/auth/me")
async def get_current_user(username: str = Depends(verify_token)):
    """Get current user info"""
    user = load_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "success": True,
        "user": {"username": user["username"], "email": user["email"]}
    }

@app.get("/")
async def root():
    return {"message": "CV Generator API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/upload-cv")
async def upload_cv(file: UploadFile = File(...), username: str = Depends(verify_token)):
    """Upload and parse existing CV"""
    try:
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Parse the CV based on file type
        if file.filename.endswith('.pdf'):
            from utils.pdf_parser import parse_pdf
            cv_data = parse_pdf(file_path)
        elif file.filename.endswith('.docx'):
            from utils.docx_parser import parse_docx
            cv_data = parse_docx(file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        return {"success": True, "data": cv_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-cv")
async def generate_cv(cv_data: CVData, username: str = Depends(verify_token)):
    """Generate optimized CV using AI"""
    try:
        from utils.ai_generator import generate_optimized_cv
        optimized_cv = generate_optimized_cv(cv_data)
        return {"success": True, "data": optimized_cv}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-motivation-letter")
async def generate_motivation_letter(request: MotivationLetterRequest, username: str = Depends(verify_token)):
    """Generate motivation letter using AI"""
    try:
        from utils.ai_generator import generate_motivation_letter
        letter = generate_motivation_letter(
            request.cv_data, 
            request.job_description, 
            request.company_name,
            request.style
        )
        return {"success": True, "data": letter}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/job-match")
async def job_match(request: JobMatchRequest, username: str = Depends(verify_token)):
    """Calculate job match score"""
    try:
        from utils.ai_generator import calculate_job_match
        match_result = calculate_job_match(request.cv_data, request.job_description)
        return {"success": True, "data": match_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ats-optimize")
async def ats_optimize(cv_data: CVData, username: str = Depends(verify_token)):
    """Optimize CV for ATS systems"""
    try:
        from utils.ai_generator import ats_optimize_cv
        suggestions = ats_optimize_cv(cv_data)
        return {"success": True, "data": {"suggestions": suggestions}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export-pdf")
async def export_pdf(cv_data: CVData, username: str = Depends(verify_token)):
    """Export CV as PDF"""
    try:
        from utils.pdf_exporter import export_cv_to_pdf
        pdf_path = export_cv_to_pdf(cv_data)
        return {"success": True, "file_path": pdf_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
