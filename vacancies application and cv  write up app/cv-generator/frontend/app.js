// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Check authentication on page load
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize authentication
if (!checkAuth()) {
    throw new Error('Not authenticated');
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Display current user name
const currentUser = getCurrentUser();
if (currentUser) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = currentUser.username;
    }
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}

// Current CV data
let currentCVData = {
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    job_description: ''
};

// Current template
let currentTemplate = 'modern';

// Current font size
let currentFontSize = 12;

// Current accent color
let currentAccentColor = '#3b82f6';

// Sidebar navigation switching
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        const tabElement = document.getElementById(tabId);
        if (tabElement) {
            tabElement.classList.add('active');
        }
    });
});

// Quick action buttons
const quickCreateBtn = document.getElementById('quickCreate');
if (quickCreateBtn) {
    quickCreateBtn.addEventListener('click', () => {
        document.querySelector('[data-tab="editor"]').click();
        showToast('Creating new resume...', 'info');
    });
}

const quickTemplateBtn = document.getElementById('quickTemplate');
if (quickTemplateBtn) {
    quickTemplateBtn.addEventListener('click', () => {
        document.querySelector('[data-tab="templates"]').click();
    });
}

const quickCoverBtn = document.getElementById('quickCover');
if (quickCoverBtn) {
    quickCoverBtn.addEventListener('click', () => {
        document.querySelector('[data-tab="cover-letters"]').click();
    });
}

// Create new resume button
const createNewResumeBtn = document.getElementById('createNewResume');
if (createNewResumeBtn) {
    createNewResumeBtn.addEventListener('click', () => {
        document.querySelector('[data-tab="editor"]').click();
        showToast('Creating new resume...', 'info');
    });
}

// Editor toolbar functionality
const editModeBtn = document.getElementById('editModeBtn');
const previewModeBtn = document.getElementById('previewModeBtn');
const cvDocument = document.getElementById('cvDocument');

if (editModeBtn && previewModeBtn) {
    editModeBtn.addEventListener('click', () => {
        editModeBtn.classList.add('active');
        previewModeBtn.classList.remove('active');
        if (cvDocument) {
            cvDocument.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.contentEditable = 'true';
            });
        }
        showToast('Edit mode enabled', 'info');
    });

    previewModeBtn.addEventListener('click', () => {
        previewModeBtn.classList.add('active');
        editModeBtn.classList.remove('active');
        if (cvDocument) {
            cvDocument.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.contentEditable = 'false';
            });
        }
        showToast('Preview mode enabled', 'info');
    });
}

// Template switching in properties panel
document.querySelectorAll('.template-option').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.template-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const template = btn.dataset.template;
        if (cvDocument) {
            cvDocument.className = `cv-document ${template}`;
        }
        currentTemplate = template;
        showToast(`Switched to ${template} template`, 'success');
    });
});

// Font family selection
const fontFamilySelect = document.getElementById('fontFamily');
if (fontFamilySelect) {
    fontFamilySelect.addEventListener('change', (e) => {
        if (cvDocument) {
            cvDocument.style.fontFamily = e.target.value;
        }
        showToast('Font updated', 'success');
    });
}

// Font size controls
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const sizeValue = document.querySelector('.size-value');
        if (btn.dataset.size === 'increase') {
            currentFontSize = Math.min(currentFontSize + 2, 24);
        } else {
            currentFontSize = Math.max(currentFontSize - 2, 8);
        }
        if (sizeValue) {
            sizeValue.textContent = `${currentFontSize}px`;
        }
        if (cvDocument) {
            cvDocument.style.fontSize = `${currentFontSize}px`;
        }
        showToast(`Font size: ${currentFontSize}px`, 'info');
    });
});

// Color picker
document.querySelectorAll('.color-option').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const color = btn.dataset.color;
        currentAccentColor = color;
        
        if (cvDocument) {
            cvDocument.querySelectorAll('.cv-title, .cv-section h2, .exp-company').forEach(el => {
                el.style.color = color;
            });
            cvDocument.querySelectorAll('.skill-fill, .progress-fill').forEach(el => {
                el.style.background = color;
            });
            cvDocument.querySelectorAll('.cv-section h2').forEach(el => {
                el.style.borderBottomColor = color;
            });
        }
        showToast('Accent color updated', 'success');
    });
});

// Section visibility toggles
document.querySelectorAll('.section-toggle input').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        const section = e.target.dataset.section;
        const sectionElement = document.querySelector(`.cv-section[data-section="${section}"]`);
        if (sectionElement) {
            sectionElement.style.display = e.target.checked ? 'block' : 'none';
        }
        showToast(`Section ${e.target.checked ? 'shown' : 'hidden'}`, 'info');
    });
});

// Close properties panel
const closePanelBtn = document.getElementById('closePanelBtn');
const propertiesPanel = document.getElementById('propertiesPanel');
if (closePanelBtn && propertiesPanel) {
    closePanelBtn.addEventListener('click', () => {
        propertiesPanel.style.display = 'none';
    });
}

// Template gallery - use template buttons
document.querySelectorAll('.use-template-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const templateCard = btn.closest('.template-card');
        const template = templateCard.dataset.template;
        
        document.querySelector('[data-tab="editor"]').click();
        
        if (cvDocument) {
            cvDocument.className = `cv-document ${template}`;
        }
        currentTemplate = template;
        
        // Update properties panel template selection
        document.querySelectorAll('.template-option').forEach(opt => {
            opt.classList.remove('active');
            if (opt.dataset.template === template) {
                opt.classList.add('active');
            }
        });
        
        showToast(`Applied ${template} template`, 'success');
    });
});

// Cover letter generation
const generateCoverLetterBtn = document.getElementById('generateCoverLetter');
if (generateCoverLetterBtn) {
    generateCoverLetterBtn.addEventListener('click', async () => {
        const company = document.getElementById('coverCompany').value;
        const jobTitle = document.getElementById('coverJobTitle').value;
        const jobDesc = document.getElementById('coverJobDesc').value;
        const tone = document.getElementById('coverTone').value;
        
        if (!company || !jobDesc) {
            showToast('Please fill in required fields', 'error');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/generate-motivation-letter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cv_data: currentCVData,
                    job_description: jobDesc,
                    company_name: company,
                    style: tone
                })
            });

            const result = await response.json();
            
            if (result.success) {
                const previewDiv = document.getElementById('coverLetterPreview');
                if (previewDiv) {
                    previewDiv.innerHTML = `
                        <div class="generated-letter">
                            <h3>Cover Letter for ${company}</h3>
                            <div contenteditable="true" style="min-height: 300px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; line-height: 1.6;">
                                ${result.data}
                            </div>
                            <div style="margin-top: 20px; display: flex; gap: 12px;">
                                <button class="btn-primary" onclick="copyToClipboard(this)">Copy to Clipboard</button>
                                <button class="btn-secondary" onclick="downloadAsText(this)">Download</button>
                            </div>
                        </div>
                    `;
                }
                showToast('Cover letter generated successfully!', 'success');
            } else {
                showToast('Failed to generate cover letter', 'error');
            }
        } catch (error) {
            console.error('Cover letter generation error:', error);
            showToast('Error generating cover letter', 'error');
        }
    });
}

// Download button
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/export-pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(currentCVData)
            });

            const result = await response.json();
            
            if (result.success) {
                const link = document.createElement('a');
                link.href = `http://localhost:8000/uploads/${result.file_path.split('/').pop()}`;
                link.download = 'resume.pdf';
                link.click();
                showToast('PDF downloaded successfully!', 'success');
            } else {
                showToast('Failed to download PDF', 'error');
            }
        } catch (error) {
            console.error('Download error:', error);
            showToast('Error downloading PDF', 'error');
        }
    });
}

// AI suggestions button
const aiSuggestBtn = document.getElementById('aiSuggestBtn');
if (aiSuggestBtn) {
    aiSuggestBtn.addEventListener('click', () => {
        showToast('AI suggestions feature coming soon!', 'info');
    });
}

// Spell check button
const spellCheckBtn = document.getElementById('spellCheckBtn');
if (spellCheckBtn) {
    spellCheckBtn.addEventListener('click', () => {
        showToast('Spell check feature coming soon!', 'info');
    });
}

// Share button
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        showToast('Share feature coming soon!', 'info');
    });
}

// Floating AI assistant
const aiAssistantBtn = document.getElementById('aiAssistantBtn');
if (aiAssistantBtn) {
    aiAssistantBtn.addEventListener('click', () => {
        showToast('AI Assistant coming soon!', 'info');
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Copy to clipboard helper
function copyToClipboard(btn) {
    const letterContent = btn.previousElementSibling;
    const text = letterContent.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        showToast('Failed to copy', 'error');
    });
}

// Download as text helper
function downloadAsText(btn) {
    const letterContent = btn.previousElementSibling.previousElementSibling;
    const text = letterContent.innerText;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cover-letter.txt';
    link.click();
    URL.revokeObjectURL(url);
    
    showToast('Downloaded successfully!', 'success');
}

// Auto-save functionality
let autoSaveTimeout;
function triggerAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        // Save current CV data to localStorage
        localStorage.setItem('currentCVData', JSON.stringify(currentCVData));
        showToast('Auto-saved', 'success');
    }, 2000);
}

// Listen for content changes to trigger auto-save
if (cvDocument) {
    cvDocument.addEventListener('input', () => {
        triggerAutoSave();
    });
}

// Load saved CV data on page load
const savedCVData = localStorage.getItem('currentCVData');
if (savedCVData) {
    try {
        currentCVData = JSON.parse(savedCVData);
    } catch (e) {
        console.error('Error loading saved CV data:', e);
    }
}

// CV Upload
const uploadArea = document.getElementById('uploadArea');
const cvUpload = document.getElementById('cvUpload');
const uploadStatus = document.getElementById('uploadStatus');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#764ba2';
    uploadArea.style.background = '#f8f9fa';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.background = 'white';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.background = 'white';
    const files = e.dataTransfer.files;
    if (files.length) {
        handleFileUpload(files[0]);
    }
});

cvUpload.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFileUpload(e.target.files[0]);
    }
});

async function handleFileUpload(file) {
    uploadStatus.className = 'status';
    uploadStatus.textContent = 'Uploading and parsing CV...';
    uploadStatus.style.display = 'block';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/upload-cv`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const result = await response.json();
        
        if (result.success) {
            currentCVData = result.data;
            populateFormWithCVData(result.data);
            populateEditorWithCVData(result.data);
            
            uploadStatus.className = 'status success';
            uploadStatus.textContent = 'CV uploaded successfully! Check the Editor tab to view and edit.';
            
            // Switch to editor tab
            setTimeout(() => {
                document.querySelector('[data-tab="editor"]').click();
            }, 1500);
        }
    } catch (error) {
        uploadStatus.className = 'status error';
        uploadStatus.textContent = 'Error uploading CV: ' + error.message;
        console.error('Upload error:', error);
    }
}

function populateFormWithCVData(data) {
    document.getElementById('name').value = data.name || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('summary').value = data.summary || '';
    document.getElementById('skills').value = data.skills ? data.skills.join(', ') : '';
    
    // Clear existing experience and education
    document.getElementById('experienceContainer').innerHTML = '';
    document.getElementById('educationContainer').innerHTML = '';
    
    // Add experience items
    if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
            addExperienceItem(exp.title, exp.description);
        });
    } else {
        addExperienceItem();
    }
    
    // Add education items
    if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
            addEducationItem(edu.title, edu.description);
        });
    } else {
        addEducationItem();
    }
}

function populateEditorWithCVData(data) {
    document.getElementById('cvName').textContent = data.name || 'Your Name';
    document.getElementById('cvContact').textContent = 
        `${data.email || 'email@example.com'} | ${data.phone || '+1 234 567 8900'}`;
    document.getElementById('cvSummary').textContent = data.summary || 'Your professional summary will appear here...';
    document.getElementById('cvSkills').textContent = data.skills ? data.skills.join(', ') : 'Skill 1, Skill 2, Skill 3';
    
    // Update experience in editor
    const expContainer = document.getElementById('cvExperience');
    expContainer.innerHTML = '';
    
    if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
            const expItem = document.createElement('div');
            expItem.className = 'cv-item';
            expItem.innerHTML = `
                <h3 contenteditable="true">${exp.title || 'Job Title'}</h3>
                <p contenteditable="true">${exp.description || 'Company Name'}</p>
                <p contenteditable="true">${exp.description || 'Job description and key achievements...'}</p>
            `;
            expContainer.appendChild(expItem);
        });
    } else {
        expContainer.innerHTML = `
            <div class="cv-item">
                <h3 contenteditable="true">Job Title</h3>
                <p contenteditable="true">Company Name</p>
                <p contenteditable="true">Job description and key achievements...</p>
            </div>
        `;
    }
    
    // Update education in editor
    const eduContainer = document.getElementById('cvEducation');
    eduContainer.innerHTML = '';
    
    if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
            const eduItem = document.createElement('div');
            eduItem.className = 'cv-item';
            eduItem.innerHTML = `
                <h3 contenteditable="true">${edu.title || 'Degree'}</h3>
                <p contenteditable="true">${edu.description || 'University Name, Year'}</p>
            `;
            eduContainer.appendChild(eduItem);
        });
    } else {
        eduContainer.innerHTML = `
            <div class="cv-item">
                <h3 contenteditable="true">Degree</h3>
                <p contenteditable="true">University Name, Year</p>
            </div>
        `;
    }
}

// Manual Entry Form
document.getElementById('cvForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Collect form data
    currentCVData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        summary: document.getElementById('summary').value,
        job_description: document.getElementById('jobDescription').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s),
        experience: [],
        education: []
    };
    
    // Collect experience
    document.querySelectorAll('.experience-item').forEach(item => {
        const title = item.querySelector('.exp-title').value;
        const company = item.querySelector('.exp-company').value;
        const description = item.querySelector('.exp-description').value;
        if (title) {
            currentCVData.experience.push({ title, company, description });
        }
    });
    
    // Collect education
    document.querySelectorAll('.education-item').forEach(item => {
        const degree = item.querySelector('.edu-degree').value;
        const school = item.querySelector('.edu-school').value;
        const year = item.querySelector('.edu-year').value;
        if (degree) {
            currentCVData.education.push({ title: degree, description: `${school}, ${year}` });
        }
    });
    
    // Populate editor
    populateEditorWithCVData(currentCVData);
    
    // Switch to editor tab
    document.querySelector('[data-tab="editor"]').click();
});

// Add Experience
document.getElementById('addExperience').addEventListener('click', () => {
    addExperienceItem();
});

function addExperienceItem(title = '', company = '', description = '') {
    const container = document.getElementById('experienceContainer');
    const item = document.createElement('div');
    item.className = 'experience-item';
    item.innerHTML = `
        <input type="text" class="exp-title" placeholder="Job Title" value="${title}">
        <input type="text" class="exp-company" placeholder="Company" value="${company}">
        <textarea class="exp-description" rows="2" placeholder="Job description and achievements">${description}</textarea>
        <button type="button" class="btn-secondary" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(item);
}

// Add Education
document.getElementById('addEducation').addEventListener('click', () => {
    addEducationItem();
});

function addEducationItem(degree = '', school = '', year = '') {
    const container = document.getElementById('educationContainer');
    const item = document.createElement('div');
    item.className = 'education-item';
    item.innerHTML = `
        <input type="text" class="edu-degree" placeholder="Degree" value="${degree}">
        <input type="text" class="edu-school" placeholder="School/University" value="${school}">
        <input type="text" class="edu-year" placeholder="Year" value="${year}">
        <button type="button" class="btn-secondary" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(item);
}

// CV Editor Functions
document.getElementById('formatCV').addEventListener('click', () => {
    autoFormatCV();
});

document.getElementById('optimizeCV').addEventListener('click', async () => {
    await optimizeCV();
});

document.getElementById('atsOptimize').addEventListener('click', async () => {
    await atsOptimize();
});

document.getElementById('spellCheck').addEventListener('click', () => {
    spellCheck();
});

document.getElementById('exportPDF').addEventListener('click', async () => {
    await exportToPDF();
});

document.getElementById('saveCV').addEventListener('click', () => {
    saveCurrentCV();
});

// Template switching
document.querySelectorAll('.template-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.template-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        const template = option.dataset.template;
        const editor = document.getElementById('cvEditor');
        
        // Remove all template classes
        editor.classList.remove('modern', 'professional', 'creative', 'minimalist');
        // Add selected template class
        editor.classList.add(template);
        
        currentTemplate = template;
    });
});

function autoFormatCV() {
    // Auto-format the CV content
    const name = document.getElementById('cvName').textContent;
    document.getElementById('cvName').textContent = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Format skills to be comma-separated and capitalized
    const skills = document.getElementById('cvSkills').textContent;
    const formattedSkills = skills.split(',')
        .map(s => s.trim())
        .filter(s => s)
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(', ');
    document.getElementById('cvSkills').textContent = formattedSkills;
    
    // Format experience titles
    document.querySelectorAll('#cvExperience h3').forEach(h3 => {
        const text = h3.textContent;
        h3.textContent = text.charAt(0).toUpperCase() + text.slice(1);
    });
    
    // Format education titles
    document.querySelectorAll('#cvEducation h3').forEach(h3 => {
        const text = h3.textContent;
        h3.textContent = text.charAt(0).toUpperCase() + text.slice(1);
    });
    
    alert('CV auto-formatted successfully!');
}

async function atsOptimize() {
    try {
        updateCVDataFromEditor();
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/ats-optimize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(currentCVData)
        });

        if (!response.ok) throw new Error('ATS optimization failed');

        const result = await response.json();
        
        if (result.success) {
            // Show ATS suggestions
            showATSSuggestions(result.data.suggestions);
            alert('CV optimized for ATS! Check the suggestions below.');
        }
    } catch (error) {
        console.error('ATS optimization error:', error);
        // Fallback to basic ATS suggestions
        showBasicATSSuggestions();
    }
}

function showATSSuggestions(suggestions) {
    const editor = document.getElementById('cvEditor');
    
    // Remove existing ATS suggestions
    const existingSuggestions = editor.querySelector('.ats-suggestions');
    if (existingSuggestions) existingSuggestions.remove();
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'ats-suggestions';
    suggestionsDiv.innerHTML = `
        <h4>🎯 ATS Optimization Suggestions</h4>
        ${suggestions.map(s => `
            <div class="ats-suggestion-item">
                <p>${s.text}</p>
                <span class="priority">Priority: ${s.priority}</span>
            </div>
        `).join('')}
    `;
    
    editor.appendChild(suggestionsDiv);
}

function showBasicATSSuggestions() {
    const editor = document.getElementById('cvEditor');
    
    // Remove existing ATS suggestions
    const existingSuggestions = editor.querySelector('.ats-suggestions');
    if (existingSuggestions) existingSuggestions.remove();
    
    const suggestions = [
        { text: 'Use standard section headings like "Experience", "Education", "Skills"', priority: 'High' },
        { text: 'Include keywords from the job description in your skills section', priority: 'High' },
        { text: 'Avoid tables, columns, and complex formatting', priority: 'Medium' },
        { text: 'Use bullet points for experience descriptions', priority: 'Medium' },
        { text: 'Save your CV in a simple format (PDF or DOCX)', priority: 'Low' }
    ];
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'ats-suggestions';
    suggestionsDiv.innerHTML = `
        <h4>🎯 ATS Optimization Suggestions</h4>
        ${suggestions.map(s => `
            <div class="ats-suggestion-item">
                <p>${s.text}</p>
                <span class="priority">Priority: ${s.priority}</span>
            </div>
        `).join('')}
    `;
    
    editor.appendChild(suggestionsDiv);
}

function spellCheck() {
    const editor = document.getElementById('cvEditor');
    const text = editor.innerText;
    
    // Simple spell check using browser's built-in functionality
    const words = text.split(/\s+/);
    const commonMisspellings = {
        'teh': 'the',
        'recieve': 'receive',
        'occured': 'occurred',
        'seperate': 'separate',
        'definately': 'definitely',
        'occassion': 'occasion',
        'accomodate': 'accommodate',
        'acheive': 'achieve',
        'accross': 'across',
        'agressive': 'aggressive',
        'apparant': 'apparent',
        'arguement': 'argument',
        'beggining': 'beginning',
        'beleive': 'believe',
        'calender': 'calendar',
        'catagory': 'category',
        'cemetary': 'cemetery',
        'collegue': 'colleague',
        'comming': 'coming',
        'commitee': 'committee',
        'completly': 'completely',
        'concious': 'conscious',
        'curiousity': 'curiosity',
        'decieve': 'deceive',
        'desparate': 'desperate',
        'diffrent': 'different',
        'disapear': 'disappear',
        'disapoint': 'disappoint',
        'embarass': 'embarrass',
        'enviroment': 'environment',
        'exagerate': 'exaggerate',
        'excercise': 'exercise',
        'experiance': 'experience',
        'familar': 'familiar',
        'finaly': 'finally',
        'forteen': 'fourteen',
        'fourty': 'forty',
        'freind': 'friend',
        'goverment': 'government',
        'grammer': 'grammar',
        'gaurd': 'guard',
        'happend': 'happened',
        'heighth': 'height',
        'heros': 'heroes',
        'humorous': 'humorous',
        'immediatly': 'immediately',
        'independant': 'independent',
        'intresting': 'interesting',
        'knowlege': 'knowledge',
        'liason': 'liaison',
        'libary': 'library',
        'lisence': 'license',
        'maintainance': 'maintenance',
        'manuever': 'maneuver',
        'millenium': 'millennium',
        'minature': 'miniature',
        'neccessary': 'necessary',
        'neigbor': 'neighbor',
        'noticable': 'noticeable',
        'occurance': 'occurrence',
        'oficial': 'official',
        'origional': 'original',
        'pavillion': 'pavilion',
        'percieve': 'perceive',
        'performence': 'performance',
        'personel': 'personnel',
        'posession': 'possession',
        'potatos': 'potatoes',
        'precede': 'precede',
        'predjudice': 'prejudice',
        'privelege': 'privilege',
        'profesion': 'profession',
        'promiss': 'promise',
        'pronounciation': 'pronunciation',
        'publically': 'publicly',
        'questionaire': 'questionnaire',
        'realy': 'really',
        'recomend': 'recommend',
        'refered': 'referred',
        'relevent': 'relevant',
        'religous': 'religious',
        'remeber': 'remember',
        'repetition': 'repetition',
        'resistence': 'resistance',
        'responsability': 'responsibility',
        'rythm': 'rhythm',
        'sacrilegious': 'sacrilegious',
        'sargent': 'sergeant',
        'satelite': 'satellite',
        'sence': 'sense',
        'sentance': 'sentence',
        'sieze': 'seize',
        'similiar': 'similar',
        'sincerly': 'sincerely',
        'speach': 'speech',
        'sucess': 'success',
        'supercede': 'supersede',
        'suprise': 'surprise',
        'temperture': 'temperature',
        'tendancy': 'tendency',
        'therefor': 'therefore',
        'thier': 'their',
        'tomatos': 'tomatoes',
        'tommorow': 'tomorrow',
        'tounge': 'tongue',
        'truely': 'truly',
        'unfortunatly': 'unfortunately',
        'untill': 'until',
        'unusal': 'unusual',
        'upholstry': 'upholstery',
        'usible': 'usable',
        'vaccuum': 'vacuum',
        'vegetble': 'vegetable',
        'vehical': 'vehicle',
        'visious': 'vicious',
        'weird': 'weird',
        'wellfare': 'welfare',
        'wether': 'whether',
        'wich': 'which',
        'wierd': 'weird',
        'writting': 'writing',
        'yacht': 'yacht',
        'yeild': 'yield',
        'zebra': 'zebra',
        'zuchini': 'zucchini'
    };
    
    let errorsFound = 0;
    words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
        if (commonMisspellings[cleanWord]) {
            errorsFound++;
        }
    });
    
    if (errorsFound > 0) {
        alert(`Found ${errorsFound} potential spelling errors. Review your CV for common misspellings.`);
    } else {
        alert('No common spelling errors found!');
    }
}

async function optimizeCV() {
    try {
        // Update current CV data from editor
        updateCVDataFromEditor();
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/generate-cv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(currentCVData)
        });

        if (!response.ok) throw new Error('Optimization failed');

        const result = await response.json();
        
        if (result.success) {
            populateEditorWithCVData(result.data);
            alert('CV optimized successfully with AI!');
        }
    } catch (error) {
        console.error('Optimization error:', error);
        alert('Error optimizing CV: ' + error.message);
    }
}

async function exportToPDF() {
    try {
        updateCVDataFromEditor();
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/export-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(currentCVData)
        });

        if (!response.ok) throw new Error('Export failed');

        const result = await response.json();
        
        if (result.success) {
            // Download the PDF
            const link = document.createElement('a');
            link.href = `http://localhost:8000/uploads/${result.file_path.split('/').pop()}`;
            link.download = 'cv.pdf';
            link.click();
            
            alert('PDF exported successfully!');
        }
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting PDF: ' + error.message);
    }
}

function updateCVDataFromEditor() {
    currentCVData.name = document.getElementById('cvName').textContent;
    const contact = document.getElementById('cvContact').textContent.split('|');
    currentCVData.email = contact[0].trim();
    currentCVData.phone = contact[1] ? contact[1].trim() : '';
    currentCVData.summary = document.getElementById('cvSummary').textContent;
    currentCVData.skills = document.getElementById('cvSkills').textContent.split(',').map(s => s.trim()).filter(s => s);
    
    // Update experience from editor
    currentCVData.experience = [];
    document.querySelectorAll('#cvExperience .cv-item').forEach(item => {
        const title = item.querySelector('h3').textContent;
        const paragraphs = item.querySelectorAll('p');
        currentCVData.experience.push({
            title: title,
            company: paragraphs[0].textContent,
            description: paragraphs[1] ? paragraphs[1].textContent : ''
        });
    });
    
    // Update education from editor
    currentCVData.education = [];
    document.querySelectorAll('#cvEducation .cv-item').forEach(item => {
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        currentCVData.education.push({ title, description });
    });
}

// Motivation Letter Generation
document.getElementById('motivationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const companyName = document.getElementById('companyName').value;
    const jobDescription = document.getElementById('motivationJobDesc').value;
    const letterStyle = document.getElementById('letterStyle').value;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/generate-motivation-letter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                cv_data: currentCVData,
                job_description: jobDescription,
                company_name: companyName,
                style: letterStyle
            })
        });

        if (!response.ok) throw new Error('Generation failed');

        const result = await response.json();
        
        if (result.success) {
            const resultDiv = document.getElementById('motivationResult');
            resultDiv.innerHTML = `
                <h3>Generated Motivation Letter (${letterStyle.charAt(0).toUpperCase() + letterStyle.slice(1)} Style)</h3>
                <div contenteditable="true" style="min-height: 300px; padding: 20px; border: 1px solid #e9ecef; border-radius: 10px;">
                    ${result.data}
                </div>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn-primary" onclick="copyMotivationLetter()">Copy to Clipboard</button>
                    <button class="btn-secondary" onclick="downloadMotivationLetter()">Download as Text</button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Generation error:', error);
        alert('Error generating motivation letter: ' + error.message);
    }
});

function copyMotivationLetter() {
    const letterDiv = document.querySelector('#motivationResult div[contenteditable]');
    const text = letterDiv.innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Motivation letter copied to clipboard!');
    });
}

function downloadMotivationLetter() {
    const letterDiv = document.querySelector('#motivationResult div[contenteditable]');
    const text = letterDiv.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motivation_letter.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Job Matching
document.getElementById('jobMatchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const jobDescription = document.getElementById('matchJobDesc').value;
    updateCVDataFromEditor();
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/job-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                cv_data: currentCVData,
                job_description: jobDescription
            })
        });

        if (!response.ok) throw new Error('Job matching failed');

        const result = await response.json();
        
        if (result.success) {
            showJobMatchResult(result.data);
        }
    } catch (error) {
        console.error('Job matching error:', error);
        // Fallback to basic job matching
        showBasicJobMatch(jobDescription);
    }
});

function showJobMatchResult(data) {
    const resultDiv = document.getElementById('matchResult');
    resultDiv.innerHTML = `
        <div class="job-match-score">
            <div class="score-label">Match Score</div>
            <div class="score-number">${data.score}%</div>
        </div>
        <div class="match-details">
            <h4>Skills Analysis</h4>
            ${data.skills.map(skill => `
                <div class="match-item">
                    <span class="skill-name">${skill.name}</span>
                    <span class="${skill.matched ? 'match-status' : 'missing'}">${skill.matched ? '✓ Matched' : '✗ Missing'}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function showBasicJobMatch(jobDescription) {
    updateCVDataFromEditor();
    
    // Extract keywords from job description
    const jobKeywords = jobDescription.toLowerCase()
        .match(/\b\w{4,}\b/g) || [];
    const uniqueJobKeywords = [...new Set(jobKeywords)];
    
    // Check which skills match
    const userSkills = currentCVData.skills.map(s => s.toLowerCase());
    const matchedSkills = [];
    const missingSkills = [];
    
    uniqueJobKeywords.forEach(keyword => {
        const isMatched = userSkills.some(skill => 
            skill.includes(keyword) || keyword.includes(skill)
        );
        if (isMatched) {
            matchedSkills.push(keyword);
        } else if (keyword.length > 5) { // Only show significant missing keywords
            missingSkills.push(keyword);
        }
    });
    
    const score = Math.round((matchedSkills.length / Math.max(uniqueJobKeywords.length, 1)) * 100);
    
    const resultDiv = document.getElementById('matchResult');
    resultDiv.innerHTML = `
        <div class="job-match-score">
            <div class="score-label">Match Score</div>
            <div class="score-number">${score}%</div>
        </div>
        <div class="match-details">
            <h4>Matched Skills (${matchedSkills.length})</h4>
            ${matchedSkills.slice(0, 10).map(skill => `
                <div class="match-item">
                    <span class="skill-name">${skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
                    <span class="match-status">✓ Matched</span>
                </div>
            `).join('')}
            ${missingSkills.length > 0 ? `
                <h4 style="margin-top: 20px;">Potential Missing Skills (${missingSkills.length})</h4>
                ${missingSkills.slice(0, 5).map(skill => `
                    <div class="match-item">
                        <span class="skill-name">${skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
                        <span class="missing">Consider adding</span>
                    </div>
                `).join('')}
            ` : ''}
        </div>
    `;
}

// Save/Load CVs
function saveCurrentCV() {
    updateCVDataFromEditor();
    
    const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
    const cvName = prompt('Enter a name for this CV:', currentCVData.name || 'My CV');
    
    if (!cvName) return;
    
    const cvToSave = {
        id: Date.now(),
        name: cvName,
        data: { ...currentCVData },
        template: currentTemplate,
        date: new Date().toISOString()
    };
    
    savedCVs.push(cvToSave);
    localStorage.setItem('savedCVs', JSON.stringify(savedCVs));
    
    alert('CV saved successfully!');
}

function loadSavedCVs() {
    const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
    const listDiv = document.getElementById('savedCVsList');
    
    if (savedCVs.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: #6c757d;">No saved CVs yet</p>';
        return;
    }
    
    listDiv.innerHTML = savedCVs.map(cv => `
        <div class="saved-cv-item">
            <div>
                <div class="cv-name">${cv.name}</div>
                <div class="cv-date">${new Date(cv.date).toLocaleDateString()}</div>
            </div>
            <div class="cv-actions">
                <button class="btn-secondary" onclick="loadCV(${cv.id})">Load</button>
                <button class="btn-secondary" onclick="deleteCV(${cv.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadCV(cvId) {
    const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
    const cv = savedCVs.find(c => c.id === cvId);
    
    if (cv) {
        currentCVData = cv.data;
        populateEditorWithCVData(cv.data);
        
        // Set template
        currentTemplate = cv.template || 'modern';
        const editor = document.getElementById('cvEditor');
        editor.classList.remove('modern', 'professional', 'creative', 'minimalist');
        editor.classList.add(currentTemplate);
        
        // Update template selector
        document.querySelectorAll('.template-option').forEach(opt => {
            opt.classList.remove('active');
            if (opt.dataset.template === currentTemplate) {
                opt.classList.add('active');
            }
        });
        
        // Switch to editor tab
        document.querySelector('[data-tab="editor"]').click();
        
        alert(`CV "${cv.name}" loaded successfully!`);
    }
}

function deleteCV(cvId) {
    if (!confirm('Are you sure you want to delete this CV?')) return;
    
    const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
    const filteredCVs = savedCVs.filter(c => c.id !== cvId);
    localStorage.setItem('savedCVs', JSON.stringify(filteredCVs));
    
    loadSavedCVs();
}

document.getElementById('saveCurrentCV').addEventListener('click', saveCurrentCV);

document.getElementById('clearAllSaved').addEventListener('click', () => {
    if (!confirm('Are you sure you want to delete all saved CVs?')) return;
    localStorage.removeItem('savedCVs');
    loadSavedCVs();
});

// Initialize with empty experience and education
addExperienceItem();
addEducationItem();
