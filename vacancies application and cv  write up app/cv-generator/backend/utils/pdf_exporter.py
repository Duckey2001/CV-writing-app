from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from pathlib import Path
from typing import Dict
import tempfile

def export_cv_to_pdf(cv_data: Dict) -> str:
    """Export CV data to professionally formatted PDF"""
    try:
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        pdf_path = temp_file.name
        temp_file.close()
        
        # Create PDF document
        doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
        styles = getSampleStyleSheet()
        story = []
        
        # Custom styles
        header_style = ParagraphStyle(
            'Header',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor('#2C3E50'),
            alignment=1  # Center
        )
        
        name_style = ParagraphStyle(
            'Name',
            parent=styles['Heading1'],
            fontSize=20,
            spaceAfter=12,
            textColor=colors.HexColor('#2C3E50')
        )
        
        contact_style = ParagraphStyle(
            'Contact',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=30,
            textColor=colors.HexColor('#7F8C8D')
        )
        
        section_style = ParagraphStyle(
            'Section',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.HexColor('#2C3E50')
        )
        
        normal_style = ParagraphStyle(
            'Normal',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=8,
            leading=14
        )
        
        # Header with name
        story.append(Paragraph(cv_data.get('name', 'Your Name'), name_style))
        
        # Contact information
        contact_info = f"{cv_data.get('email', '')} | {cv_data.get('phone', '')}"
        story.append(Paragraph(contact_info, contact_style))
        
        # Summary
        if cv_data.get('summary'):
            story.append(Paragraph('Professional Summary', section_style))
            story.append(Paragraph(cv_data['summary'], normal_style))
        
        # Experience
        if cv_data.get('experience'):
            story.append(Paragraph('Work Experience', section_style))
            for exp in cv_data['experience']:
                story.append(Paragraph(f"<b>{exp.get('title', 'Position')}</b>", normal_style))
                if exp.get('description'):
                    story.append(Paragraph(exp['description'], normal_style))
                story.append(Spacer(1, 12))
        
        # Education
        if cv_data.get('education'):
            story.append(Paragraph('Education', section_style))
            for edu in cv_data['education']:
                story.append(Paragraph(f"<b>{edu.get('title', 'Degree')}</b>", normal_style))
                if edu.get('description'):
                    story.append(Paragraph(edu['description'], normal_style))
                story.append(Spacer(1, 12))
        
        # Skills
        if cv_data.get('skills'):
            story.append(Paragraph('Skills', section_style))
            skills_text = ', '.join(cv_data['skills'])
            story.append(Paragraph(skills_text, normal_style))
        
        # Build PDF
        doc.build(story)
        
        return pdf_path
        
    except Exception as e:
        raise Exception(f"Error generating PDF: {str(e)}")
