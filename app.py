from flask import Flask, request, jsonify
from flask_cors import CORS
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
model = genai.GenerativeModel('gemini-2.0-flash')

# Configuration from environment variables
PORT = int(os.getenv('PORT', 5001))
HOST = os.getenv('HOST', '0.0.0.0')  # Changed to 0.0.0.0 to allow external connections
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

app = Flask(__name__, template_folder="Templates")
CORS(app)  # Enable CORS for all routes


def load_template(template_name):
    """Load HTML template from templates folder"""
    path = os.path.join(app.template_folder, template_name)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Template {template_name} not found")
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
    try:
        print("=== CV GENERATION REQUEST RECEIVED ===")
        print(f"Request method: {request.method}")
        print(f"Request headers: {dict(request.headers)}")
        print(f"Request content type: {request.content_type}")
        
        # Get JSON data
        if not request.is_json:
            print("❌ Request is not JSON")
            return jsonify({"error": "Request must be JSON"}), 400
        
        data = request.get_json()
        print(f"Received data keys: {list(data.keys()) if data else 'None'}")
        
        if not data:
            print("❌ No data received")
            return jsonify({"error": "No data received"}), 400
        
        template_choice = data.get("template", "cv_1")
        answers = data.get("questionnaire", {})
        
        print(f"Template choice: {template_choice}")
        print(f"Answers keys: {list(answers.keys()) if answers else 'None'}")
        
        # Validate template
        template_file = f"{template_choice}.html"
        try:
            cv_template = load_template(template_file)
            print(f"✅ Template loaded successfully: {template_file}")
        except FileNotFoundError:
            print(f"❌ Template file not found: {template_file}")
            return jsonify({"error": f"Template {template_choice} not found"}), 404
        
        # Prepare prompt
        prompt = (
            "Fill this HTML CV template with the given JSON user data. "
            "If any section data is missing or empty, remove that section from the CV. "
            "Add new sections if relevant data is present. "
            "Summary should be ~100 words. If user doesn't add summary just write one using his skills and experiences. "
            "There should be 5 bullets for every experience (generate if missing). "
            "Enhance or elaborate descriptions where needed, but preserve structure and style. "
            "Output only the final HTML.\n"
            + cv_template + "\nUserData:\n" + json.dumps(answers, indent=2)
        )
        
        print("Sending request to Gemini AI...")
        print(f"Prompt length: {len(prompt)} characters")
        
        # Generate content with error handling
        try:
            response = model.generate_content(prompt)
            print("✅ Gemini AI response received")
            print(f"Response type: {type(response)}")
            print(f"Response text length: {len(response.text) if hasattr(response, 'text') else 'No text attribute'}")
            
            if hasattr(response, 'text') and response.text:
                print("✅ Returning generated HTML")
                return response.text, 200, {'Content-Type': 'text/html'}
            else:
                print("❌ No text in Gemini response")
                return jsonify({"error": "No content generated by AI"}), 500
                
        except Exception as ai_error:
            print(f"❌ Gemini AI error: {str(ai_error)}")
            print(f"Error type: {type(ai_error)}")
            return jsonify({"error": f"AI generation failed: {str(ai_error)}"}), 500
            
    except Exception as e:
        print(f"❌ General error in generate_cv: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500


if __name__ == '__main__':
    print(f"🚀 Starting Resume Builder Backend")
    print(f"📍 Host: {HOST}")
    print(f"🔌 Port: {PORT}")
    print(f"🐛 Debug: {DEBUG}")
    print(f"🔑 API Key: {'✅ Configured' if api_key else '❌ Missing'}")
    print("=" * 50)
    
    app.run(debug=DEBUG, host=HOST, port=PORT)

