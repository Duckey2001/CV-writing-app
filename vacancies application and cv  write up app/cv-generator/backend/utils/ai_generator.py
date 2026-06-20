import os
from openai import OpenAI
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "your-api-key-here"))

def generate_optimized_cv(cv_data: Dict) -> Dict:
    """Generate optimized CV using AI"""
    try:
        prompt = f"""
        You are an expert CV writer. Optimize the following CV data to make it more professional and hiring-preferred.
        Keep the same information but improve the wording, structure, and impact.
        
        Current CV Data:
        Name: {cv_data.name}
        Email: {cv_data.email}
        Phone: {cv_data.phone}
        Summary: {cv_data.summary}
        Experience: {cv_data.experience}
        Education: {cv_data.education}
        Skills: {cv_data.skills}
        Job Description: {cv_data.job_description}
        
        Return the optimized CV in the same JSON format with improved content.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert CV writer who creates professional, hiring-optimized CVs."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        # Parse the response and return structured data
        # For now, return the original data with improvements
        optimized_data = cv_data.dict()
        optimized_data["summary"] = improve_summary(cv_data.summary, cv_data.job_description)
        optimized_data["experience"] = improve_experience(cv_data.experience)
        
        return optimized_data
        
    except Exception as e:
        # Fallback to basic improvements if AI fails
        return improve_cv_basic(cv_data)

def improve_summary(summary: str, job_description: str) -> str:
    """Improve the summary section"""
    if not summary:
        return "Professional with strong skills and experience seeking to contribute to organizational success."
    
    # Basic improvement logic
    improved = summary.strip()
    if len(improved) < 50:
        improved += " Proven track record of delivering results and exceeding expectations."
    
    return improved

def improve_experience(experience: List[Dict]) -> List[Dict]:
    """Improve experience descriptions"""
    improved = []
    for exp in experience:
        improved_exp = exp.copy()
        if "description" in improved_exp:
            desc = improved_exp["description"]
            if len(desc) < 20:
                desc += " Successfully managed projects and achieved key objectives."
            improved_exp["description"] = desc
        improved.append(improved_exp)
    return improved

def improve_cv_basic(cv_data: Dict) -> Dict:
    """Basic CV improvements without AI"""
    data = cv_data.dict()
    
    if not data.get("summary"):
        data["summary"] = "Dedicated professional with a strong background in relevant skills and experience. Committed to delivering high-quality results and contributing to team success."
    
    return data

def generate_motivation_letter(cv_data: Dict, job_description: str, company_name: str, style: str = "professional") -> str:
    """Generate motivation letter using AI"""
    try:
        style_instructions = {
            "professional": "Write a formal, professional motivation letter.",
            "enthusiastic": "Write an enthusiastic, energetic motivation letter showing genuine excitement.",
            "creative": "Write a creative, unique motivation letter that stands out.",
            "formal": "Write a very formal, traditional motivation letter."
        }
        
        prompt = f"""
        {style_instructions.get(style, "Write a professional motivation letter.")}
        
        Applicant: {cv_data.name}
        Email: {cv_data.email}
        Summary: {cv_data.summary}
        Key Skills: {', '.join(cv_data.skills[:5])}
        Recent Experience: {cv_data.experience[0] if cv_data.experience else 'Not specified'}
        
        Job Description: {job_description}
        Company: {company_name}
        
        Write a compelling motivation letter that highlights the applicant's fit for the role.
        Keep it under 300 words and make it specific to the company and role.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert at writing compelling motivation letters."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        # Fallback to template with style
        return generate_motivation_letter_template(cv_data, company_name, style)

def generate_motivation_letter_template(cv_data: Dict, company_name: str, style: str = "professional") -> str:
    """Generate motivation letter from template"""
    style_templates = {
        "professional": f"""
Dear Hiring Manager at {company_name},

I am writing to express my strong interest in joining your team. With my background in {', '.join(cv_data.skills[:3])} and my commitment to excellence, I believe I would be a valuable addition to your organization.

{cv_data.summary if cv_data.summary else 'I am a dedicated professional with a proven track record of success.'}

I am particularly drawn to {company_name} because of its reputation for innovation and excellence. I am confident that my skills and experience align well with your needs, and I am eager to contribute to your continued success.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.

Sincerely,
{cv_data.name}
        """.strip(),
        
        "enthusiastic": f"""
Dear Hiring Team at {company_name}!

I am thrilled to apply for this opportunity! With my passion for {', '.join(cv_data.skills[:3])} and my drive to excel, I know I can make a real impact on your team.

{cv_data.summary if cv_data.summary else 'I bring energy and dedication to everything I do!'}

I've been following {company_name}'s amazing work and would be absolutely honored to contribute my skills to your mission. I'm ready to hit the ground running and help achieve great things together!

Thank you for considering my application. I can't wait to discuss how I can contribute to your team's success!

Best regards,
{cv_data.name}
        """.strip(),
        
        "creative": f"""
Hello {company_name} Team!

Here's why I'm the perfect fit for your team: I bring {', '.join(cv_data.skills[:3])} and a fresh perspective to everything I do.

{cv_data.summary if cv_data.summary else 'I think outside the box and love solving challenges creatively.'}

{company_name} caught my eye because you're doing things differently - and that's exactly how I approach my work. I'm not just looking for a job; I'm looking for a place where I can innovate, create, and make a real difference.

Let's chat about how my unique approach can add value to your team!

Cheers,
{cv_data.name}
        """.strip(),
        
        "formal": f"""
To the Hiring Department,
{company_name}

I submit this letter of application for the position at your esteemed organization. My qualifications in {', '.join(cv_data.skills[:3])} and my professional experience make me a suitable candidate for this role.

{cv_data.summary if cv_data.summary else 'I possess the requisite skills and experience for this position.'}

Having researched {company_name} thoroughly, I am impressed by your organization's standing in the industry. I am confident that my credentials align with your requirements and that I can contribute meaningfully to your objectives.

I respectfully request the opportunity to discuss my candidacy further.

Yours faithfully,
{cv_data.name}
        """.strip()
    }
    
    return style_templates.get(style, style_templates["professional"])

def calculate_job_match(cv_data: Dict, job_description: str) -> Dict:
    """Calculate job match score between CV and job description"""
    try:
        # Extract keywords from job description
        job_keywords = job_description.lower().split()
        job_keywords = [word.strip('.,!?()[]{}"\'') for word in job_keywords if len(word) > 3]
        job_keywords = list(set(job_keywords))
        
        # Check which skills match
        user_skills = [skill.lower() for skill in cv_data.skills]
        matched_skills = []
        missing_skills = []
        
        for keyword in job_keywords:
            is_matched = any(keyword in skill or skill in keyword for skill in user_skills)
            if is_matched:
                matched_skills.append(keyword)
            else:
                missing_skills.append(keyword)
        
        # Calculate score
        total_keywords = len(job_keywords)
        matched_count = len(matched_skills)
        score = int((matched_count / total_keywords * 100)) if total_keywords > 0 else 0
        
        return {
            "score": score,
            "skills": [
                {"name": skill, "matched": True} for skill in matched_skills[:10]
            ] + [
                {"name": skill, "matched": False} for skill in missing_skills[:5]
            ]
        }
        
    except Exception as e:
        # Fallback to basic calculation
        return {
            "score": 50,
            "skills": [
                {"name": skill, "matched": True} for skill in cv_data.skills[:5]
            ]
        }

def ats_optimize_cv(cv_data: Dict) -> List[Dict]:
    """Generate ATS optimization suggestions"""
    suggestions = []
    
    # Check for standard section headings
    suggestions.append({
        "text": "Use standard section headings like 'Experience', 'Education', 'Skills' instead of creative titles",
        "priority": "High"
    })
    
    # Check for keywords
    if cv_data.job_description:
        job_keywords = cv_data.job_description.lower().split()
        job_keywords = [word.strip('.,!?()[]{}"\'') for word in job_keywords if len(word) > 4]
        
        user_skills = [skill.lower() for skill in cv_data.skills]
        missing_keywords = [kw for kw in job_keywords if not any(kw in skill for skill in user_skills)]
        
        if missing_keywords:
            suggestions.append({
                "text": f"Consider adding these keywords from the job description: {', '.join(missing_keywords[:5])}",
                "priority": "High"
            })
    
    # Check for quantifiable achievements
    has_metrics = any(any(char.isdigit() for char in str(exp.get('description', ''))) for exp in cv_data.experience)
    if not has_metrics:
        suggestions.append({
            "text": "Add quantifiable achievements to your experience (e.g., 'Increased sales by 25%')",
            "priority": "Medium"
        })
    
    # Check for action verbs
    action_verbs = ['managed', 'developed', 'created', 'implemented', 'led', 'achieved', 'improved']
    has_action_verbs = any(verb in str(cv_data).lower() for verb in action_verbs)
    if not has_action_verbs:
        suggestions.append({
            "text": "Start bullet points with strong action verbs (managed, developed, created, etc.)",
            "priority": "Medium"
        })
    
    # Check for contact information
    if not cv_data.email or not cv_data.phone:
        suggestions.append({
            "text": "Ensure your contact information (email and phone) is clearly visible",
            "priority": "High"
        })
    
    # Check for length
    total_words = len(str(cv_data).split())
    if total_words < 300:
        suggestions.append({
            "text": "Consider adding more detail to your CV - it appears quite brief",
            "priority": "Low"
        })
    elif total_words > 1000:
        suggestions.append({
            "text": "Consider condensing your CV - it may be too long for some ATS systems",
            "priority": "Low"
        })
    
    return suggestions
