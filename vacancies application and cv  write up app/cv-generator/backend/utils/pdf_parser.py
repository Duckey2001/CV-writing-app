import PyPDF2
from pathlib import Path
from typing import Dict, List

def parse_pdf(file_path: Path) -> Dict:
    """Parse PDF CV and extract structured data"""
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
        
        # Extract structured data from text
        cv_data = extract_cv_data(text)
        return cv_data
    except Exception as e:
        raise Exception(f"Error parsing PDF: {str(e)}")

def extract_cv_data(text: str) -> Dict:
    """Extract structured CV data from raw text"""
    # This is a simple extraction - in production, use AI for better parsing
    lines = text.split('\n')
    
    cv_data = {
        "name": "",
        "email": "",
        "phone": "",
        "summary": "",
        "experience": [],
        "education": [],
        "skills": []
    }
    
    # Simple extraction logic
    for i, line in enumerate(lines):
        line = line.strip()
        if '@' in line and '.' in line:
            cv_data["email"] = line
        elif any(c.isdigit() for c in line) and len(line) > 10:
            cv_data["phone"] = line
        elif line.lower() in ['experience', 'work experience', 'employment']:
            cv_data["experience"] = extract_section(lines, i+1)
        elif line.lower() in ['education', 'academic']:
            cv_data["education"] = extract_section(lines, i+1)
        elif line.lower() in ['skills', 'technical skills']:
            cv_data["skills"] = extract_skills(lines, i+1)
    
    # Set name as first non-empty line
    for line in lines:
        if line.strip() and len(line.strip()) > 2:
            cv_data["name"] = line.strip()
            break
    
    return cv_data

def extract_section(lines: List[str], start_idx: int) -> List[Dict]:
    """Extract a section from CV"""
    section = []
    current_item = {}
    
    for i in range(start_idx, min(start_idx + 20, len(lines))):
        line = lines[i].strip()
        if not line:
            continue
        if line.lower() in ['education', 'skills', 'experience']:
            break
        if not current_item:
            current_item["title"] = line
        elif "description" not in current_item:
            current_item["description"] = line
            section.append(current_item)
            current_item = {}
    
    return section

def extract_skills(lines: List[str], start_idx: int) -> List[str]:
    """Extract skills from CV"""
    skills = []
    for i in range(start_idx, min(start_idx + 10, len(lines))):
        line = lines[i].strip()
        if not line:
            continue
        if line.lower() in ['education', 'experience']:
            break
        skills.extend([s.strip() for s in line.split(',') if s.strip()])
    
    return skills[:10]  # Limit to top 10 skills
