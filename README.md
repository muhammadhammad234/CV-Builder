# 🎨 Enhanced Resume Builder

A modern, responsive React application with beautiful animations for creating professional resumes with multiple templates and dynamic form fields.

## ✨ Features

- **🎭 Beautiful Animations**: Smooth transitions, fade effects, and interactive animations
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🎨 Multiple Templates**: Professional and Creative templates with unique styling
- **➕ Dynamic Forms**: Add multiple entries for education, experience, certifications, projects, and awards
- **🔍 Real-time Preview**: See your resume as you build it
- **💾 Download & Print**: Download as HTML or print directly
- **🤖 AI-Powered**: Uses Google Gemini AI to enhance and format your resume content
- **📊 Comprehensive Logging**: Detailed logging for debugging and monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.7 or higher)
- Google Gemini API key

### 1. Setup Environment
```bash
# Clone or navigate to the project
cd CV_builder

# Set up your API key
python setup_api_key.py
```

### 2. Install Dependencies
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install React dependencies
cd resume-builder
npm install
cd ..
```

### 3. Start the Application
```bash
# Start both backend and frontend with one command
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

# Test with detailed logging
python test_backend.py
```

### Test Frontend
- Open browser console to see detailed logs
- Use "Test Backend Connection" button in the builder
- Check network tab for API calls

## 📋 Usage Guide

### 1. Template Selection
- Choose between Professional and Creative templates
- Each template has unique animations and styling
- Templates are fully responsive

### 2. Form Building
- **Personal Information**: Basic contact details
- **Professional Summary**: Optional (AI-generated if not provided)
- **Education**: Add multiple degrees and institutions
- **Experience**: Add multiple job positions with full details
- **Skills**: Technical and soft skills
- **Certifications**: Multiple professional certifications
- **Projects**: Showcase multiple projects
- **Awards**: Highlight achievements
- **Languages**: Languages you speak
- **Courses**: Relevant courses and certifications

### 3. Resume Generation
- Click "Generate Resume" to create your CV
- AI enhances and formats your content
- Preview the generated resume
- Download as HTML or print directly

## 🔧 Technical Details

### Frontend (React)
- **Framework**: React 18 with Hooks
- **UI Library**: Material-UI (MUI) with custom animations
- **Routing**: React Router v6
- **HTTP Client**: Axios with error handling
- **Animations**: Fade, Slide, Zoom, Grow effects

### Backend (Flask)
- **Framework**: Flask with CORS support
- **AI Integration**: Google Gemini AI
- **Templates**: HTML templates with CSS styling
- **Error Handling**: Comprehensive error logging
- **Port**: 5001 (to avoid conflicts)

### API Endpoints
- `GET /health` - Health check
- `GET /questionnaire?template=cv_1` - Get questionnaire
- `POST /generate-cv` - Generate resume

## 🐛 Troubleshooting

### Common Issues

1. **Port 5000 in use**
   - The app now uses port 5001 by default
   - Update any hardcoded URLs to use port 5001

2. **Backend not responding**
   ```bash
   # Check if backend is running
   curl http://localhost:5001/health
   
   # Check logs
   python test_simple.py
   ```

3. **CORS errors**
   - Backend has CORS enabled
   - Frontend proxy is configured for port 5001

4. **AI generation fails**
   - Check your Gemini API key in `.env`
   - Ensure you have sufficient API credits
   - Check backend logs for detailed error messages

### Debug Mode
- **Frontend**: Open browser console for detailed logs
- **Backend**: Check terminal output for request/response logs
- **API Testing**: Use the test scripts for endpoint verification

## 📁 Project Structure

```
CV_builder/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create this)
├── Templates/            # HTML templates
│   ├── cv_1.html        # Professional template
│   └── cv_2.html        # Creative template
├── test_simple.py        # Simple backend tests
├── test_backend.py       # Comprehensive backend tests
├── start_app.py          # Auto-start script
├── start_app.bat         # Windows start script
└── resume-builder/       # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── TemplateSelection.js
    │   │   ├── ResumeBuilder.js
    │   │   └── ResumePreview.js
    │   ├── App.js
    │   └── App.css
    ├── package.json
    └── README.md
```

## 🎨 Animation Features

### Template Selection
- **Fade In**: Smooth page transitions
- **Slide Effects**: Directional animations
- **Zoom Effects**: Interactive scaling
- **Grow Effects**: Staggered card animations
- **Hover Effects**: Interactive feedback

### Form Builder
- **Staggered Animations**: Sections appear sequentially
- **Smooth Transitions**: All interactions are animated
- **Loading States**: Visual feedback during operations
- **Error Animations**: Smooth error display

### Resume Preview
- **Fullscreen Mode**: Toggle with animations
- **Download Animation**: Visual feedback
- **Print Preview**: Optimized for printing
- **Success Animation**: Celebration effects

## 🔒 Security Notes

- API keys are stored in `.env` file (not committed to git)
- CORS is configured for development
- Input validation on both frontend and backend
- Error messages don't expose sensitive information

## 📈 Performance

- **Lazy Loading**: Components load as needed
- **Optimized Animations**: Hardware-accelerated CSS
- **Efficient State Management**: Minimal re-renders
- **Caching**: Generated resumes cached in localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

## 🎉 Success!

Your enhanced Resume Builder is now running with:
- ✅ Beautiful animations and transitions
- ✅ Comprehensive error handling and logging
- ✅ Working backend API on port 5001
- ✅ Responsive React frontend on port 3000
- ✅ AI-powered resume generation
- ✅ Multiple template support

**Access your application at: http://localhost:3000**
