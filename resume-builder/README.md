# CV Builder - Professional Resume & Cover Letter Generator

A modern, responsive React application for creating professional resumes, cover letters, and ATS analysis with multiple templates and AI-powered content generation.

## Features

- **Resume Builder**: Create professional resumes with multiple templates and dynamic form fields
- **Cover Letter Builder**: Generate personalized cover letters tailored to specific job descriptions
- **ATS Score Checker**: Analyze your resume against job descriptions for better ATS compatibility
- **Multiple Templates**: Choose from professional resume and cover letter templates
- **Dynamic Forms**: Add multiple entries for education, experience, certifications, projects, and awards
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Preview**: See your documents as you build them
- **Download & Print**: Download as HTML or print directly
- **AI-Powered**: Uses Google Gemini AI to enhance and format your content
- **Glass Theme UI**: Modern glassmorphism design with beautiful animations

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- Google Gemini API key

## Quick Start

### Option 1: One-Command Setup (Recommended)

1. Navigate to the project root directory:
   ```bash
   cd /path/to/CV_builder
   ```

2. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the project with a single command:
   ```bash
   python start.py
   ```

   This will automatically:
   - Start the Flask backend server
   - Start the React frontend development server
   - Open your browser to the application

### Option 2: Manual Setup

#### 1. Backend Setup

1. Navigate to the project root directory:
   ```bash
   cd /path/to/CV_builder
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the Flask backend:
   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5001`

#### 2. Frontend Setup

1. Navigate to the React app directory:
   ```bash
   cd resume-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The React app will run on `http://localhost:3000`

## Usage

### Resume Builder
1. **Select Template**: Choose between Professional or Creative template
2. **Fill Information**: Complete the form with your personal and professional details
3. **Add Multiple Entries**: Use the "Add" buttons to include multiple education, experience, certifications, projects, or awards
4. **Generate Resume**: Click "Generate Resume" to create your professional resume
5. **Preview & Download**: Review your resume and download or print it

### Cover Letter Builder
1. **Enter Job Information**: Fill in company name, job description, application date, and HR manager details
2. **Add Your Information**: Provide your personal details, skills, and relevant experience
3. **Generate Cover Letter**: Click "Generate Cover Letter" to create a personalized cover letter
4. **Preview & Download**: Review your cover letter and download or print it

### ATS Score Checker
1. **Upload Resume**: Upload your resume in PDF format
2. **Enter Job Description**: Paste the job description you're applying for
3. **Choose Analysis Type**: Select from ATS Score, Resume Analysis, Improvement Tips, or Tailor Resume
4. **Generate Analysis**: Get detailed feedback and suggestions for improvement

## Form Features

### Resume Builder - Dynamic Sections
- **Education**: Add multiple degrees, universities, graduation years, and GPAs
- **Experience**: Include multiple job positions with titles, companies, dates, and responsibilities
- **Certifications**: List multiple professional certifications
- **Projects**: Showcase multiple projects with descriptions and technologies
- **Awards**: Highlight multiple achievements and awards

### Resume Builder - Single Sections
- **Personal Information**: Name, email, phone, address, LinkedIn, portfolio
- **Professional Summary**: Optional summary (AI-generated if not provided)
- **Skills**: Technical skills, soft skills, frameworks, tools, programming languages
- **Languages**: Languages you speak
- **Courses**: Relevant courses and certifications

### Cover Letter Builder
- **Job Information**: Company name, job description, application date, HR manager name, how you found the job
- **Applicant Information**: Name, designation, contact details, skills, and relevant experience

## API Endpoints

### Resume Builder
- `GET /questionnaire?template=cv_1` - Get questionnaire for selected template
- `POST /generate-cv` - Generate resume with provided data

### Cover Letter Builder
- `GET /questionnaire-cover-letter?template=cl` - Get cover letter questionnaire
- `POST /generate-cover-letter` - Generate cover letter with provided data

### ATS Checker
- `POST /ats-analyze` - Comprehensive ATS analysis with different analysis types
- `POST /generate-ats-score` - Generate ATS score for resume vs job description
- `POST /generate-resume-from-job` - Generate resume based on job description

## Technologies Used

### Frontend
- React 18
- Material-UI (MUI)
- React Router
- Axios
- Glassmorphism UI Design

### Backend
- Flask
- Google Gemini AI
- Flask-CORS
- PyMuPDF (for PDF processing)

## Project Structure

```
CV_builder/
├── app.py                 # Flask backend
├── start.py              # One-command startup script
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (create this)
├── Templates/            # Resume HTML templates
│   ├── cv_1.html
│   └── cv_2.html
├── Cover_Letter/         # Cover letter HTML templates
│   └── cl.html
└── resume-builder/       # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── ToolSelection.js
    │   │   ├── TemplateSelection.js
    │   │   ├── ResumeBuilder.js
    │   │   ├── ResumePreview.js
    │   │   ├── CoverLetterBuilder.js
    │   │   ├── CoverLetterPreview.js
    │   │   └── ATSChecker.js
    │   ├── App.js
    │   ├── App.css
    │   └── config.js
    ├── package.json
    └── README.md
```

## Customization

### Adding New Templates
1. Create a new HTML template in the `Templates/` directory for resumes
2. Create a new HTML template in the `Cover_Letter/` directory for cover letters
3. The backend will automatically detect new templates

### Modifying Form Fields
Edit the form structure in the respective builder components to add, remove, or modify form fields.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the Flask backend is running and CORS is enabled
2. **API Key Issues**: Verify your Gemini API key is correctly set in the `.env` file
3. **Port Conflicts**: Make sure ports 3000 (React) and 5001 (Flask) are available
4. **PDF Processing**: Ensure PyMuPDF is installed for ATS checker functionality

### Getting Help
- Check the browser console for frontend errors
- Check the Flask server logs for backend errors
- Ensure all dependencies are properly installed
- Verify your API key has sufficient quota

## License

This project is open source and available under the MIT License.
