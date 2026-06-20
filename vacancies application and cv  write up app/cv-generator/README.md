# CV Generator - Professional Resume Builder

An intelligent CV and motivation letter generator that helps you create professional, hiring-optimized resumes with AI assistance.

## Features

### Core Features
- **CV Upload**: Upload existing CVs (PDF/DOCX) for automatic parsing
- **Manual Entry**: Enter your information manually through forms
- **AI-Powered Generation**: Optimize your CV using AI for better results
- **Editable Interface**: Edit your CV with a rich text editor that auto-formats content
- **Motivation Letters**: Generate personalized motivation letters for job applications
- **PDF Export**: Export your CV as a professionally formatted PDF
- **Auto-Formatting**: Automatically arrange and format your CV content

### Enhanced Features
- **Multiple CV Templates**: Choose from Modern, Professional, Creative, or Minimalist templates
- **Dark Mode**: Toggle between light and dark themes for comfortable editing
- **Job Matching**: Analyze how well your CV matches job descriptions with scoring
- **ATS Optimization**: Get suggestions to optimize your CV for Applicant Tracking Systems
- **Spell Check**: Built-in spell checking with common misspelling detection
- **Save/Load CVs**: Save multiple CV versions locally and load them later
- **Motivation Letter Styles**: Choose from Professional, Enthusiastic, Creative, or Formal styles
- **Real-time Editing**: Live preview with instant formatting and arrangement

## Tech Stack

### Backend
- FastAPI (Python)
- OpenAI GPT for AI-powered generation
- PyPDF2 for PDF parsing
- python-docx for DOCX parsing
- ReportLab for PDF generation

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design
- Contenteditable rich text editor
- Modern UI with gradient styling

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd cv-generator/backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
- Edit the `.env` file
- Add your OpenAI API key: `OPENAI_API_KEY=your-api-key-here`

### Frontend Setup

The frontend is a simple HTML/CSS/JavaScript application that runs directly in the browser. No build process required.

Simply open `frontend/index.html` in your web browser.

## Running the Application

### Start the Backend Server

```bash
cd cv-generator/backend
python main.py
```

The backend will start on `http://localhost:8000`

### Access the Frontend

Open `frontend/index.html` in your web browser, or navigate to:
```
file:///path/to/cv-generator/frontend/index.html
```

## Usage

### 1. Upload Existing CV

- Click the "Upload CV" tab
- Drag and drop your CV file (PDF/DOCX) or click to browse
- The system will automatically parse and extract your information
- Review and edit in the CV Editor tab

### 2. Manual Entry

- Click the "Manual Entry" tab
- Fill in your personal information, experience, education, and skills
- Optionally paste a job description for AI optimization
- Click "Generate CV" to create your CV

### 3. Edit Your CV

- Click the "CV Editor" tab
- Choose a template (Modern, Professional, Creative, or Minimalist)
- Edit any section by clicking on it (contenteditable)
- Use "Auto-Format" to automatically arrange and format your content
- Use "AI Optimize" to let AI improve your CV content
- Use "ATS Optimize" to get suggestions for Applicant Tracking Systems
- Use "Spell Check" to detect common spelling errors
- Use "Save CV" to save your current version
- Use "Export PDF" to download your CV as a PDF

### 4. Generate Motivation Letter

- Click the "Motivation Letter" tab
- Enter the company name and job description
- Choose a letter style (Professional, Enthusiastic, Creative, or Formal)
- Click "Generate Letter" to create a personalized motivation letter
- Edit the letter as needed
- Copy to clipboard or download as text file

### 5. Job Matching

- Click the "Job Match" tab
- Paste a job description
- Click "Analyze Match" to see how well your CV matches
- View your match score and matched/missing skills
- Get suggestions for improving your match

### 6. Manage Saved CVs

- Click the "Saved CVs" tab
- View all your previously saved CV versions
- Load any saved CV to continue editing
- Delete CVs you no longer need
- Clear all saved CVs if desired

## API Endpoints

### POST `/api/upload-cv`
Upload and parse an existing CV file.

### POST `/api/generate-cv`
Generate an optimized CV using AI.

### POST `/api/generate-motivation-letter`
Generate a motivation letter using AI. Supports different styles (professional, enthusiastic, creative, formal).

### POST `/api/job-match`
Calculate job match score between CV and job description.

### POST `/api/ats-optimize`
Get ATS optimization suggestions for your CV.

### POST `/api/export-pdf`
Export CV data as a PDF file.

## Configuration

### OpenAI API Key

To use AI-powered features, you need an OpenAI API key:

1. Get an API key from https://platform.openai.com/
2. Add it to `backend/.env`:
```
OPENAI_API_KEY=sk-your-actual-api-key
```

### Without AI API Key

The app will still work without an API key using template-based generation:
- CV optimization will use basic improvements
- Motivation letters will use professional templates

## Project Structure

```
cv-generator/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── .env                # Environment variables
│   └── utils/
│       ├── __init__.py
│       ├── pdf_parser.py   # PDF parsing logic
│       ├── docx_parser.py  # DOCX parsing logic
│       ├── ai_generator.py # AI-powered generation
│       └── pdf_exporter.py # PDF export logic
└── frontend/
    ├── index.html          # Main application
    ├── styles.css          # Styling
    └── app.js              # JavaScript functionality
```

## Features in Detail

### CV Templates
- **Modern**: Clean, professional design with blue accents
- **Professional**: Traditional corporate style with formal formatting
- **Creative**: Eye-catching design with gradient backgrounds
- **Minimalist**: Simple, elegant design with minimal styling

### CV Parsing
- Extracts name, contact info, summary, experience, education, and skills
- Supports PDF and DOCX formats
- Intelligent text extraction and structuring

### AI Optimization
- Improves wording and impact of your CV
- Tailors content to job descriptions
- Enhances professional presentation

### Job Matching
- Analyzes CV skills against job description keywords
- Provides match percentage score
- Identifies matched and missing skills
- Suggests improvements for better alignment

### ATS Optimization
- Provides suggestions for Applicant Tracking System compatibility
- Recommends standard section headings
- Suggests keyword additions
- Advises on formatting and structure

### Spell Check
- Detects common misspellings
- Covers 100+ frequently misspelled words
- Provides error count and suggestions
- Helps maintain professional quality

### Auto-Formatting
- Capitalizes names and titles
- Formats skills consistently
- Arranges sections professionally
- Applies proper punctuation

### Motivation Letters
- Multiple styles: Professional, Enthusiastic, Creative, Formal
- Personalized for each company and role
- Highlights relevant skills and experience
- Professional tone and structure
- Download as text file

### Save/Load System
- Local storage for CV versions
- Save unlimited CV versions
- Load previous versions for editing
- Delete unwanted versions
- Template preference saved with CV

### Dark Mode
- Toggle between light and dark themes
- Easy on the eyes for extended editing
- Persists preference across sessions
- Full UI theme support

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Check that all dependencies are installed
- Verify port 8000 is not in use

### CV upload fails
- Ensure file is PDF or DOCX format
- Check file size (should be < 10MB)
- Verify backend server is running

### AI features not working
- Check that OPENAI_API_KEY is set in .env
- Verify API key is valid and has credits
- Check internet connection
- Note: App works with template-based generation if API key is not set

### PDF export fails
- Ensure ReportLab is installed correctly
- Check that CV data is properly formatted
- Verify backend server is running

### Job matching shows low score
- Ensure your skills are clearly listed in the Skills section
- Add relevant keywords from the job description
- Use standard terminology for skills and technologies

### Dark mode not persisting
- Check browser localStorage permissions
- Ensure JavaScript is enabled
- Try refreshing the page

### Saved CVs not appearing
- Check browser localStorage capacity
- Clear browser cache if needed
- Ensure you're using the same browser

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Update `index.html` and `app.js`
3. **Styling**: Modify `styles.css`

### Testing

Test the application by:
1. Starting the backend server
2. Opening the frontend in a browser
3. Testing each feature (upload, manual entry, editing, export)
4. Testing enhanced features (templates, dark mode, job matching, ATS optimization)
5. Testing save/load functionality
6. Testing motivation letter styles

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please refer to the troubleshooting section or check the code comments for detailed implementation information.
