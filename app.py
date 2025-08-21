from flask import Flask, request, jsonify
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=api_key)
model = genai.GenerativeModel(
    'gemini-2.0-flash',
    generation_config={"response_mime_type": "application/json"}
)

app = Flask(__name__, template_folder="Templates")


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


@app.route('/questionnaire', methods=['GET'])
def get_questionnaire():
    """
    Return hardcoded questionnaire with template info.
    Example: /questionnaire?template=cv_2
    """
    template_choice = request.args.get("template", "cv_1")  
    return jsonify({
        "template": template_choice,
        "questionnaire": QUESTIONNAIRE
    })


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

    response = model.generate_content(prompt)
    return response.text, 200, {'Content-Type': 'text/html'}


QUESTIONNAIRE_CL = {
    "job": {
        "job_description": "Paste the job description here.",
        "company": "What is the company name?",
        "hr_name": "What is the HR manager’s name? (optional, if known)",
        "date": "What is the application date?"
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

    template_choice = data.get("template", "cl")  # default template cl.html
    job_data = data.get("job", {})
    applicant_data = data.get("applicant", {})

    template_file = f"{template_choice}.html"
    cl_template = load_template(template_file, folder="cl")

    prompt = (
        "Fill this HTML Cover Letter template with the given JSON user data. "
        "Keep the structure, CSS styles, and layout exactly the same. "
        "Insert the applicant's personal info into the header section. "
        "Date should go in the left column, recipient info in the right column. "
        "Generate the body paragraphs based on job description, company, experience, and skills. "
        "Tone should be formal, polite, confident. "
        "Return only the final HTML and css code.\n"
        + cl_template
        + "\nUserData:\n"
        + json.dumps({"job": job_data, "applicant": applicant_data})
    )

    response = model.generate_content(prompt)
    return response.text, 200, {'Content-Type': 'text/html'}

if __name__ == '__main__':
    app.run(debug=True)
