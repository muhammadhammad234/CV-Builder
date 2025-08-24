# 🎨 CV Builder - Professional Resume & Cover Letter Generator

A modern, responsive React application with beautiful glassmorphism design for creating professional resumes, cover letters, and ATS analysis with multiple templates and AI-powered content generation.

## ✨ Features

### 📄 Resume Builder
- **🎭 Beautiful Animations**: Smooth transitions, fade effects, and interactive animations
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🎨 Multiple Templates**: Professional and Creative templates with unique styling
- **➕ Dynamic Forms**: Add multiple entries for education, experience, certifications, projects, and awards
- **🔍 Real-time Preview**: See your resume as you build it
- **💾 Download & Print**: Download as HTML or print directly
- **🤖 AI-Powered**: Uses Google Gemini AI to enhance and format your resume content

### 📝 Cover Letter Builder
- **🎯 Job-Specific Customization**: Generate personalized cover letters tailored to specific job descriptions
- **🏢 Company Integration**: Include company-specific information and how you found the job
- **📋 Professional Templates**: Clean, professional cover letter templates
- **🤖 AI Content Generation**: AI-powered content that matches your experience and the job requirements
- **💾 Download & Print Ready**: Professional formatting for immediate use

### 🔍 ATS Score Checker
- **📊 PDF Resume Analysis**: Upload and analyze your resume in PDF format
- **🎯 Keyword Matching**: Identify matched and missing keywords from job descriptions
- **📈 Score Breakdown**: Get detailed ATS compatibility scores with visual indicators
- **💡 Improvement Suggestions**: Receive specific recommendations to improve your resume
- **🔄 Multiple Analysis Types**: ATS Score, Resume Analysis, Improvement Tips, and Resume Tailoring
- **📄 Resume Generation**: Generate resumes from job descriptions using AI

### 🎨 UI/UX Features
- **🌟 Glassmorphism Design**: Modern glass effect with backdrop blur and transparency
- **🎭 Smooth Animations**: Fade, slide, and grow animations throughout the application
- **📱 Mobile-First Design**: Optimized for all screen sizes
- **🎨 Consistent Theme**: Beautiful gradient backgrounds and glass effects

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.7 or higher)
- Google Gemini API key

### Option 1: One-Command Setup (Recommended)

1. **Clone or navigate to the project**:
   ```bash
   cd CV_builder
   ```

2. **Set up your API key**:
   ```bash
   python setup_api_key.py
   ```
   Or create a `.env` file manually:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the project with one command**:
   ```bash
   python start.py
   ```

   This will automatically:
   - Install dependencies (if needed)
   - Start the Flask backend server
   - Start the React frontend development server
   - Open your browser to the application

### Option 2: Manual Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Install React dependencies**:
   ```bash
   cd resume-builder
   npm install
   cd ..
   ```

3. **Start the application**:
   ```bash
   python start.py
   ```

### 4. Access the Application
- **Local**: http://localhost:3000
- **Network**: http://192.168.100.20:3000 (for other devices on same WiFi)

## 🌐 Network Access

The application automatically supports network access. Other devices on the same WiFi network can access:
- **Frontend**: http://192.168.100.20:3000
- **Backend API**: http://192.168.100.20:5001

### Troubleshooting Network Access
1. **Firewall Issues**: Go to System Preferences > Security & Privacy > Firewall
2. **Same Network**: Ensure both devices are on the same WiFi network
3. **Test Connection**: Use `curl http://192.168.100.20:5001/health` to test backend

## 📖 Usage Guide

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

## 🔧 API Endpoints

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

## 🛠️ Technologies Used

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Material-UI (MUI)**: Professional UI components and theming
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Glassmorphism UI**: Modern glass effect design

### Backend
- **Flask**: Lightweight Python web framework
- **Google Gemini AI**: Advanced AI for content generation
- **Flask-CORS**: Cross-origin resource sharing
- **PyMuPDF**: PDF processing for ATS analysis

## 📁 Project Structure

```
CV_builder/
├── app.py                 # Flask backend
├── start.py              # One-command startup script
├── setup_api_key.py      # API key setup utility
├── deploy.py             # Production deployment script
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (create this)
├── env.example           # Environment variables template
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

## 🚀 Production Deployment

### Quick Production Setup
```bash
# 1. Configure production environment
cp env.example .env
# Edit .env with production settings

# 2. Run production deployment script
python deploy.py

# 3. Deploy using Docker
docker-compose up -d
```

### Manual Production Deployment
```bash
# 1. Build frontend for production
cd resume-builder
npm run build
cd ..

# 2. Start production server
python app_production.py

# 3. Or use Gunicorn for production
gunicorn -w 4 -b 0.0.0.0:5001 app_production:app
```

## 🧪 Testing

### Test Backend
```bash
# Test all backend endpoints
python test_simple.py

# Test ATS functionality
python test_ats.py
```

## 🔧 Customization

### Adding New Templates
1. Create a new HTML template in the `Templates/` directory for resumes
2. Create a new HTML template in the `Cover_Letter/` directory for cover letters
3. The backend will automatically detect new templates

### Modifying Form Fields
Edit the form structure in the respective builder components to add, remove, or modify form fields.

## 🐛 Troubleshooting

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

## 📄 License

This project is open source and available under the MIT License.
