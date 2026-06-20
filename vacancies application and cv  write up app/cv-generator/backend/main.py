from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from pathlib import Path

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

@app.get("/")
async def root():
    return {"message": "CV Generator API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/upload-cv")
async def upload_cv(file: UploadFile = File(...)):
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
async def generate_cv(cv_data: CVData):
    """Generate optimized CV using AI"""
    try:
        from utils.ai_generator import generate_optimized_cv
        optimized_cv = generate_optimized_cv(cv_data)
        return {"success": True, "data": optimized_cv}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-motivation-letter")
async def generate_motivation_letter(request: MotivationLetterRequest):
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
async def job_match(request: JobMatchRequest):
    """Calculate job match score"""
    try:
        from utils.ai_generator import calculate_job_match
        match_result = calculate_job_match(request.cv_data, request.job_description)
        return {"success": True, "data": match_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ats-optimize")
async def ats_optimize(cv_data: CVData):
    """Optimize CV for ATS systems"""
    try:
        from utils.ai_generator import ats_optimize_cv
        suggestions = ats_optimize_cv(cv_data)
        return {"success": True, "data": {"suggestions": suggestions}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export-pdf")
async def export_pdf(cv_data: CVData):
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
