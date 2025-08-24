from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
from openai import OpenAI
try:
    import fitz
except ImportError:
    # Fallback for different PyMuPDF versions
    try:
        import PyMuPDF as fitz
    except ImportError:
        print("Warning: PyMuPDF not available. PDF processing will not work.")
        fitz = None

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")


client = OpenAI(
    api_key=api_key
)

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

def clean_html_response(html_content):
    """Clean HTML response from AI model to remove markdown formatting and quotes."""
    html_content = html_content.strip()
    
    # Remove any markdown formatting if present - more robust approach
    # Handle ```html at the beginning
    if '```html' in html_content:
        start_index = html_content.find('```html') + 7
        end_index = html_content.rfind('```')
        if end_index > start_index:
            html_content = html_content[start_index:end_index].strip()
    # Handle ``` at the beginning (without html)
    elif html_content.startswith('```'):
        start_index = html_content.find('```') + 3
        end_index = html_content.rfind('```')
        if end_index > start_index:
            html_content = html_content[start_index:end_index].strip()
    
    # Remove surrounding quotes if they exist
    if html_content.startswith('"') and html_content.endswith('"'):
        html_content = html_content[1:-1]
    elif html_content.startswith("'") and html_content.endswith("'"):
        html_content = html_content[1:-1]
    
    return html_content

# Configuration from environment variables
PORT = int(os.getenv('PORT', 5001))
HOST = os.getenv('HOST', '0.0.0.0')  # Changed to 0.0.0.0 to allow external connections
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

app = Flask(__name__, template_folder="templates")
CORS(app)


def load_template(template_name, folder="Templates"):
    """Load HTML template from a given folder"""
    if folder == "cv":
        path = os.path.join("Templates", template_name)
    elif folder == "cl":
        path = os.path.join("Cover_Letter", template_name)
    else:
        raise ValueError("Invalid template folder")

    if not os.path.exists(path):
        raise FileNotFoundError(f"Template {template_name} not found in {folder} folder")

    with open(path, "r", encoding="utf-8") as f:
        return f.read()


QUESTIONNAIRE = {
    "personal_info": {
        "full_name": "What is your full name?",
        "email": "What is your email address?",
        "phone": "What is your phone number?",
        "address": "What is your address?",
        "linkedin": "Do you have a LinkedIn profile? (optional)",
        "portfolio": "Do you have an online portfolio or website? (optional)"
    },
    "summary": {
        "summary_text": "Write a short professional summary (optional, will be generated if not provided)."
    },
    "education": {
        "degree": "What is your highest degree?",
        "university": "Which university/college did you attend?",
        "graduation_year": "What year did you graduate?",
        "gpa": "What was your GPA or grade? (optional)"
    },
    "experience": {
        "job_title": "What was your job title?",
        "company": "Which company did you work at?",
        "start_date": "When did you start?",
        "end_date": "When did you end? (or 'Present')",
        "responsibilities": "List key responsibilities/achievements (optional, AI will generate if missing)."
    },
    "skills": {
        "technical_skills": "List your technical skills (comma separated).",
        "soft_skills": "List your soft skills (optional).",
        "frameworks": "List frameworks or libraries you know",
        "tools": "List tools you are familiar with",
        "languages": "List programming languages you know"
    },
    "courses": {
        "relevant_courses": "List job-related university courses or certifications you have completed."
    },
    "certifications": {
        "cert_name": "What is the certification name?",
        "issuer": "Which organization issued it?",
        "year": "What year did you earn it?"
    },
    "projects": {
        "project_title": "What is the title of your project?",
        "description": "Describe the project briefly.",
        "technologies": "Which technologies/tools were used? (optional)"
    },
    "awards/achievements": {
        "award_title": "Have you received any awards/achievements? If yes, mention them.",
        "award_year": "What year did you receive it? (optional)"
    },
    "languages": {
        "language": "List languages you know (e.g., English, Urdu, etc.)."
    }
}


import datetime

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Resume Builder API is running",
        "templates": ["cv_1", "cv_2"],
        "timestamp": str(datetime.datetime.now())
    })

@app.route('/questionnaire', methods=['GET'])
def get_questionnaire():
    """
    Return hardcoded questionnaire with template info.
    Example: /questionnaire?template=cv_2
    """
    try:
        print("=== QUESTIONNAIRE REQUEST RECEIVED ===")
        template_choice = request.args.get("template", "cv_1")
        print(f"Template requested: {template_choice}")
        
        response_data = {
            "template": template_choice,
            "questionnaire": QUESTIONNAIRE
        }
        
        print("✅ Returning questionnaire data")
        return jsonify(response_data)
    except Exception as e:
        print(f"❌ Error in questionnaire endpoint: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/generate-cv', methods=['POST'])
def generate_cv():
    """
    User sends back the questionnaire filled with answers.
    Use Gemini to merge answers into selected CV template.
    """
    data = request.get_json()
    template_choice = data.get("template", "cv_1")
    answers = data.get("questionnaire", {})

    template_file = f"{template_choice}.html"
    cv_template = load_template(template_file, folder="cv")

    prompt = (
        "Fill this HTML CV template with the given JSON user data. "
        "If any section data is missing or empty, remove that section from the CV. "
        "Add new sections if relevant data is present. "
        "Summary should be ~100 words. If user doesn't add summary just write one using his skills and experiences. "
        "There should be 5 bullets for every experience (generate if missing). "
        "Enhance or elaborate descriptions where needed, but preserve structure and style. "
        "Output only the final HTML.\n"
        + cv_template + "\nUserData:\n" + json.dumps(answers)
    )

    
    response = client.chat.completions.create(
        model="gpt-5",
        messages=[
            {"role": "system", "content": "You are a helpful cv maker assitant."},
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    # Clean the response content to ensure it's proper HTML
    html_content = clean_html_response(response.choices[0].message.content)
    
    return html_content, 200, {'Content-Type': 'text/html'}


QUESTIONNAIRE_CL = {
    "job": {
        "job_description": "Paste the job description here.",
        "company": "What is the company name?",
        "hr_name": "What is the HR manager's name? (optional, if known)",
        "date": "What is the application date?",
        "job_found": "How did you find this job?"
    },
    "applicant": {
        "name": "What is your full name?",
        "designation": "What is the job title/designation you are applying for?",
        "email": "What is your email address?",
        "phone": "What is your phone number?",
        "address": "What is your home address?",
        "past_experience": "Describe your past experience relevant to this job.",
        "skills": "List your key skills (comma separated)."
    }
}

@app.route('/questionnaire-cover-letter', methods=['GET'])
def get_questionnaire_cover_letter():
    """
    Return questionnaire for Cover Letter.
    Example: /questionnaire-cover-letter?template=cl
    """
    template_choice = request.args.get("template", "cl")
    return jsonify({
        "template": template_choice,
        "questionnaire": QUESTIONNAIRE_CL
    })


@app.route('/generate-cover-letter', methods=['POST'])
def generate_cover_letter():
    """
    User provides job and applicant info.
    Use Gemini to merge info into the Cover Letter template.
    """
    data = request.get_json()
    
    print("=== COVER LETTER GENERATION REQUEST ===")
    print("Received data:", json.dumps(data, indent=2))

    template_choice = data.get("template", "cl")  # default template cl.html
    job_data = data.get("job", {})
    applicant_data = data.get("applicant", {})
    
    print("Job data:", json.dumps(job_data, indent=2))
    print("Applicant data:", json.dumps(applicant_data, indent=2))

    template_file = f"{template_choice}.html"
    cl_template = load_template(template_file, folder="cl")

    prompt = f"""You are given an HTML Cover Letter template with placeholders and JSON user data. 
Your task is to generate the FINAL cover letter HTML by REPLACING ALL PLACEHOLDERS with the user's data.

CRITICAL REQUIREMENTS (follow exactly):
- Keep the original CSS styles and layout structure from the template.
- REPLACE ALL PLACEHOLDERS with actual user data:
  * [APPLICANT_NAME] → applicant.name
  * [APPLICANT_DESIGNATION] → applicant.designation  
  * [APPLICANT_ADDRESS] → applicant.address
  * [APPLICANT_PHONE] → applicant.phone
  * [APPLICANT_EMAIL] → applicant.email
  * [APPLICATION_DATE] → job.date
  * [HR_NAME] → job.hr_name (or "HR Manager" if empty)
  * [COMPANY_NAME] → job.company
  * [COVER_LETTER_CONTENT_PARAGRAPH_1] through [COVER_LETTER_CONTENT_PARAGRAPH_5] → Generate professional paragraphs based on job description, company, experience, and skills
- Generate 5 professional paragraphs for the cover letter content using the provided data
- Do NOT include any placeholder text or bracketed prompts
- Do NOT generate any text with square brackets
- Use the actual company name, job description, skills, and experience from the user data
- If job_found data is provided, incorporate it naturally into the content
- Output ONLY the final HTML with all placeholders replaced (no explanations, comments, or code fences)

Template:
{cl_template}

UserData (use only this data):
{json.dumps({"job": job_data, "applicant": applicant_data})}
"""

    
    response = client.chat.completions.create(
        model="gpt-5",
        messages=[
            {"role": "system", "content": "You are a helpful cv maker assitant."},
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    # Clean the response content to ensure it's proper HTML
    html_content = clean_html_response(response.choices[0].message.content)
    
    return html_content, 200, {'Content-Type': 'text/html'}

def extract_text_from_pdf(pdf_file):
    """Extract text from uploaded PDF or text file."""
    try:
        # Check if it's a PDF file
        if pdf_file.filename.lower().endswith('.pdf'):
            if fitz is None:
                raise ValueError("PyMuPDF not available. Cannot process PDF files.")
            
            text = ""
            with fitz.open(stream=pdf_file.read(), filetype="pdf") as doc:
                for page in doc:
                    text += page.get_text("text")
            return text
        else:
            # Handle text files
            pdf_file.seek(0)  # Reset file pointer
            return pdf_file.read().decode('utf-8')
    except Exception as e:
        print(f"Text extraction error: {str(e)}")
        raise ValueError(f"Failed to extract text from file: {str(e)}")

@app.route('/generate-ats-score', methods=['POST'])
def generate_ats_score():
    """
    User uploads a CV (PDF) + Job Description (text).
    The system extracts CV text, compares with JD, and generates an ATS score with breakdown in HTML.
    """
    if 'cv' not in request.files:
        return jsonify({"error": "Missing CV PDF file"}), 400

    cv_file = request.files['cv']
    job_description = request.form.get("job_description", "")

    if not job_description:
        return jsonify({"error": "Missing Job Description"}), 400

    cv_text = extract_text_from_pdf(cv_file)

    prompt = f"""
You are an ATS (Applicant Tracking System) evaluator. 
Compare the following CV with the Job Description and provide an ATS compatibility score (0-100).  
Return the result in **HTML format** with the following sections:

1. **Overall ATS Score** (percentage with color bar)  
2. **Matched Keywords** (list of important job-specific keywords found in CV)  
3. **Missing Keywords** (keywords required by JD but missing in CV)  
4. **Skills Match** (match rate and table of skills: CV vs JD)  
5. **Experience Match** (how relevant the experience is, 1-2 sentences + percentage)  
6. **Education Match** (short analysis + percentage)  
7. **Suggestions for Improvement** (bullet points for enhancing CV to improve score)

CV Text:
{cv_text}

Job Description:
{job_description}
    """

    response = client.chat.completions.create(
        model="gpt-5",
        messages=[
            {"role": "system", "content": "You are an ATS scoring assistant that outputs results in HTML format only."},
            {"role": "user", "content": prompt}
        ]
    )

    # Clean the response content to ensure it's proper HTML
    html_content = clean_html_response(response.choices[0].message.content)
    
    return html_content, 200, {'Content-Type': 'text/html'}

@app.route('/ats-analyze', methods=['POST'])
def ats_analyze():
    """
    Comprehensive ATS analysis with different analysis types.
    """
    if 'pdf_file' not in request.files:
        return jsonify({"error": "Missing PDF file"}), 400

    pdf_file = request.files['pdf_file']
    job_description = request.form.get("job_description", "")
    analysis_type = request.form.get("analysis_type", "match")

    if not job_description:
        return jsonify({"error": "Missing Job Description"}), 400

    try:
        cv_text = extract_text_from_pdf(pdf_file)
        if not cv_text or len(cv_text.strip()) < 10:
            return jsonify({"error": "Could not extract text from PDF. Please ensure the PDF contains readable text."}), 400
    except Exception as e:
        print(f"PDF extraction error: {str(e)}")
        return jsonify({"error": f"Failed to process PDF: {str(e)}"}), 400

    # Different prompts based on analysis type
    prompts = {
        'match': f"""
You are an ATS (Applicant Tracking System) evaluator. 
Compare the following CV with the Job Description and provide an ATS compatibility score (0-100).
Return the result in **HTML format** with the following sections:

1. **Overall ATS Score** (percentage with color bar)  
2. **Matched Keywords** (list of important job-specific keywords found in CV)  
3. **Missing Keywords** (keywords required by JD but missing in CV)  
4. **Skills Match** (match rate and table of skills: CV vs JD)  
5. **Experience Match** (how relevant the experience is, 1-2 sentences + percentage)  
6. **Education Match** (short analysis + percentage)  
7. **Suggestions for Improvement** (bullet points for enhancing CV to improve score)

CV Text:
{cv_text}

Job Description:
{job_description}
        """,
        
        'about': f"""
You are a resume analysis expert. 
Provide a detailed evaluation of the following CV against the job description.
Return the result in **HTML format** with the following sections:

1. **Resume Overview** (strengths and weaknesses)
2. **Content Analysis** (completeness, relevance, formatting)
3. **Keyword Optimization** (keyword density and placement)
4. **Experience Relevance** (how well experience matches job requirements)
5. **Skills Assessment** (technical and soft skills evaluation)
6. **Education Fit** (educational background relevance)
7. **Overall Assessment** (summary with recommendations)

CV Text:
{cv_text}

Job Description:
{job_description}
        """,
        
        'improve': f"""
You are a career development expert. 
Analyze the following CV and provide specific improvement recommendations.
Return the result in **HTML format** with the following sections:

1. **Skills Enhancement** (specific skills to develop)
2. **Experience Optimization** (how to better present experience)
3. **Keyword Integration** (strategic keyword placement)
4. **Formatting Improvements** (layout and structure suggestions)
5. **Content Additions** (what to add to strengthen the CV)
6. **Professional Development** (courses, certifications, activities)
7. **Action Plan** (step-by-step improvement roadmap)

CV Text:
{cv_text}

Job Description:
{job_description}
        """,
        
        'tailor': f"""
You are a resume tailoring expert. 
Create a tailored version of the following CV for the specific job description.
Return the result in **HTML format** with the following sections:

1. **Tailored Summary** (customized professional summary)
2. **Optimized Experience** (reworded experience to match job requirements)
3. **Enhanced Skills Section** (prioritized skills based on job needs)
4. **Keyword Integration** (strategically placed keywords)
5. **Relevant Achievements** (highlighted accomplishments that match job)
6. **Customized Education** (emphasized relevant education)
7. **Final Tailored CV** (complete optimized version)

CV Text:
{cv_text}

Job Description:
{job_description}
        """
    }

    prompt = prompts.get(analysis_type, prompts['match'])

    try:
        response = client.chat.completions.create(
            model="gpt-5",
            messages=[
                {"role": "system", "content": "You are an ATS analysis assistant that outputs results in HTML format only."},
                {"role": "user", "content": prompt}
            ]
        )

        # Clean the response content to ensure it's proper HTML
        html_content = clean_html_response(response.choices[0].message.content)
        
        if not html_content or len(html_content.strip()) < 50:
            return jsonify({"error": "AI response was too short or empty. Please try again."}), 500
        
        return jsonify({"response": html_content}), 200
    except Exception as e:
        print(f"AI generation error: {str(e)}")
        return jsonify({"error": f"Failed to generate analysis: {str(e)}"}), 500

@app.route('/generate-resume-from-job', methods=['POST'])
def generate_resume_from_job():
    """
    Generate a resume based on job description using AI.
    """
    data = request.get_json()
    job_description = data.get("job_description", "")

    if not job_description:
        return jsonify({"error": "Missing Job Description"}), 400

    prompt = f"""
You are a professional resume writer. 
Based on the following job description, create a comprehensive professional resume in HTML format.
The resume should be tailored to this specific job and include:

1. **Professional Summary** (tailored to the job)
2. **Key Skills** (relevant to the job requirements)
3. **Professional Experience** (relevant experience that matches the job)
4. **Education** (appropriate education background)
5. **Certifications** (if relevant to the job)
6. **Projects** (relevant projects that demonstrate skills)

Use a professional HTML template with clean styling.
Focus on keywords and requirements mentioned in the job description.

Job Description:
{job_description}
    """

    response = client.chat.completions.create(
        model="gpt-5",
        messages=[
            {"role": "system", "content": "You are a resume generation assistant that outputs results in HTML format only."},
            {"role": "user", "content": prompt}
        ]
    )

    # Clean the response content to ensure it's proper HTML
    html_content = clean_html_response(response.choices[0].message.content)
    
    return html_content, 200, {'Content-Type': 'text/html'}


if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=DEBUG)

