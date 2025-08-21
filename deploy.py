#!/usr/bin/env python3
"""
Production deployment script for Resume Builder application.
This script sets up the application for production deployment.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def check_production_env():
    """Check if production environment is properly configured."""
    print("🔍 Checking production environment...")
    
    # Check if .env file exists
    env_file = Path(".env")
    if not env_file.exists():
        print("❌ .env file not found")
        print("Please create a .env file with production configuration")
        return False
    
    # Check required environment variables
    required_vars = ['GEMINI_API_KEY', 'PORT', 'HOST']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    print("✅ Production environment configured")
    return True

def build_frontend():
    """Build the React frontend for production."""
    print("🏗️  Building React frontend...")
    
    try:
        # Change to resume-builder directory
        os.chdir("resume-builder")
        
        # Install dependencies
        print("📦 Installing dependencies...")
        subprocess.run(["npm", "install"], check=True)
        
        # Build for production
        print("🔨 Building for production...")
        subprocess.run(["npm", "run", "build"], check=True)
        
        # Copy build to backend static folder
        build_dir = Path("build")
        if build_dir.exists():
            # Create static directory in backend if it doesn't exist
            static_dir = Path("../static")
            static_dir.mkdir(exist_ok=True)
            
            # Copy build files
            shutil.copytree(build_dir, static_dir, dirs_exist_ok=True)
            print("✅ Frontend built and copied to static directory")
        
        # Go back to root directory
        os.chdir("..")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend build failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Error building frontend: {e}")
        return False
    
    return True

def create_production_app():
    """Create production Flask app with static file serving."""
    print("🔧 Creating production Flask app...")
    
    production_app_content = '''from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

# Configuration from environment variables
PORT = int(os.getenv('PORT', 5001))
HOST = os.getenv('HOST', '0.0.0.0')
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

app = Flask(__name__, template_folder="Templates", static_folder="static")
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

@app.route('/')
def serve_frontend():
    """Serve the React frontend."""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files."""
    return send_from_directory(app.static_folder, path)

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
    """Return hardcoded questionnaire with template info."""
    try:
        template_choice = request.args.get("template", "cv_1")
        response_data = {
            "template": template_choice,
            "questionnaire": QUESTIONNAIRE
        }
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/generate-cv', methods=['POST'])
def generate_cv():
    """Generate CV using Gemini AI."""
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        template_choice = data.get("template", "cv_1")
        answers = data.get("questionnaire", {})
        
        # Validate template
        template_file = f"{template_choice}.html"
        try:
            cv_template = load_template(template_file)
        except FileNotFoundError:
            return jsonify({"error": f"Template {template_choice} not found"}), 404
        
        # Prepare prompt
        prompt = (
            "Fill this HTML CV template with the given JSON user data. "
            "If any section data is missing or empty, remove that section from the CV. "
            "Add new sections if relevant data is present. "
            "Summary should be ~100 words. If user doesn't add summary just write one using his skills and experiences. "
            "There should be 5 bullets for every experience (generate if missing). "
            "Enhance or elaborate descriptions where needed, but preserve structure and style. "
            "Output only the final HTML.\\n"
            + cv_template + "\\nUserData:\\n" + json.dumps(answers, indent=2)
        )
        
        # Generate content
        try:
            response = model.generate_content(prompt)
            if hasattr(response, 'text') and response.text:
                return response.text, 200, {'Content-Type': 'text/html'}
            else:
                return jsonify({"error": "No content generated by AI"}), 500
        except Exception as ai_error:
            return jsonify({"error": f"AI generation failed: {str(ai_error)}"}), 500
            
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    print(f"🚀 Starting Resume Builder Production Server")
    print(f"📍 Host: {HOST}")
    print(f"🔌 Port: {PORT}")
    print(f"🐛 Debug: {DEBUG}")
    print(f"🔑 API Key: {'✅ Configured' if api_key else '❌ Missing'}")
    print("=" * 50)
    
    app.run(debug=DEBUG, host=HOST, port=PORT)
'''
    
    try:
        with open("app_production.py", "w") as f:
            f.write(production_app_content)
        print("✅ Production app created: app_production.py")
        return True
    except Exception as e:
        print(f"❌ Error creating production app: {e}")
        return False

def create_requirements_production():
    """Create production requirements file."""
    print("📋 Creating production requirements...")
    
    requirements_prod = '''flask==2.3.3
google-generativeai==0.3.2
python-dotenv==1.0.0
flask-cors==4.0.0
gunicorn==21.2.0
'''
    
    try:
        with open("requirements_production.txt", "w") as f:
            f.write(requirements_prod)
        print("✅ Production requirements created: requirements_production.txt")
        return True
    except Exception as e:
        print(f"❌ Error creating production requirements: {e}")
        return False

def create_dockerfile():
    """Create Dockerfile for containerized deployment."""
    print("🐳 Creating Dockerfile...")
    
    dockerfile_content = '''# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    nodejs \\
    npm \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements_production.txt .
RUN pip install --no-cache-dir -r requirements_production.txt

# Copy package.json and install Node.js dependencies
COPY resume-builder/package*.json ./resume-builder/
WORKDIR /app/resume-builder
RUN npm install

# Build React app
COPY resume-builder/ .
RUN npm run build

# Copy built files to backend static directory
WORKDIR /app
RUN mkdir -p static && cp -r resume-builder/build/* static/

# Copy backend files
COPY Templates/ ./Templates/
COPY app_production.py ./app.py

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:5001/health || exit 1

# Run the application
CMD ["python", "app.py"]
'''
    
    try:
        with open("Dockerfile", "w") as f:
            f.write(dockerfile_content)
        print("✅ Dockerfile created")
        return True
    except Exception as e:
        print(f"❌ Error creating Dockerfile: {e}")
        return False

def create_docker_compose():
    """Create docker-compose.yml for easy deployment."""
    print("🐳 Creating docker-compose.yml...")
    
    docker_compose_content = '''version: '3.8'

services:
  resume-builder:
    build: .
    ports:
      - "5001:5001"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - PORT=5001
      - HOST=0.0.0.0
      - DEBUG=False
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
'''
    
    try:
        with open("docker-compose.yml", "w") as f:
            f.write(docker_compose_content)
        print("✅ docker-compose.yml created")
        return True
    except Exception as e:
        print(f"❌ Error creating docker-compose.yml: {e}")
        return False

def main():
    """Main deployment function."""
    print("🚀 Resume Builder - Production Deployment")
    print("=" * 50)
    
    # Check production environment
    if not check_production_env():
        print("\n❌ Production environment check failed")
        return False
    
    # Build frontend
    if not build_frontend():
        print("\n❌ Frontend build failed")
        return False
    
    # Create production app
    if not create_production_app():
        print("\n❌ Production app creation failed")
        return False
    
    # Create production requirements
    if not create_requirements_production():
        print("\n❌ Production requirements creation failed")
        return False
    
    # Create Dockerfile
    if not create_dockerfile():
        print("\n❌ Dockerfile creation failed")
        return False
    
    # Create docker-compose
    if not create_docker_compose():
        print("\n❌ docker-compose.yml creation failed")
        return False
    
    print("\n🎉 Production deployment setup complete!")
    print("\n📋 Next steps:")
    print("1. Review the generated files:")
    print("   - app_production.py (production Flask app)")
    print("   - requirements_production.txt (production dependencies)")
    print("   - Dockerfile (container configuration)")
    print("   - docker-compose.yml (orchestration)")
    print("   - static/ (built React app)")
    print("\n2. For Docker deployment:")
    print("   docker-compose up -d")
    print("\n3. For direct deployment:")
    print("   python app_production.py")
    print("\n4. For Gunicorn deployment:")
    print("   gunicorn -w 4 -b 0.0.0.0:5001 app_production:app")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
