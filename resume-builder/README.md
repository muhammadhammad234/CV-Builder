# Resume Builder

A modern, responsive React application for creating professional resumes with multiple templates and dynamic form fields.

## Features

- **Multiple Templates**: Choose from professional and creative resume templates
- **Dynamic Forms**: Add multiple entries for education, experience, certifications, projects, and awards
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Preview**: See your resume as you build it
- **Download & Print**: Download as HTML or print directly
- **AI-Powered**: Uses Google Gemini AI to enhance and format your resume content

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- Google Gemini API key

## Setup Instructions

### 1. Backend Setup

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

   The backend will run on `http://localhost:5000`

### 2. Frontend Setup

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

1. **Select Template**: Choose between Professional or Creative template
2. **Fill Information**: Complete the form with your personal and professional details
3. **Add Multiple Entries**: Use the "Add" buttons to include multiple education, experience, certifications, projects, or awards
4. **Generate Resume**: Click "Generate Resume" to create your professional resume
5. **Preview & Download**: Review your resume and download or print it

## Form Features

### Dynamic Sections
- **Education**: Add multiple degrees, universities, graduation years, and GPAs
- **Experience**: Include multiple job positions with titles, companies, dates, and responsibilities
- **Certifications**: List multiple professional certifications
- **Projects**: Showcase multiple projects with descriptions and technologies
- **Awards**: Highlight multiple achievements and awards

### Single Sections
- **Personal Information**: Name, email, phone, address, LinkedIn, portfolio
- **Professional Summary**: Optional summary (AI-generated if not provided)
- **Skills**: Technical skills, soft skills, frameworks, tools, programming languages
- **Languages**: Languages you speak
- **Courses**: Relevant courses and certifications

## API Endpoints

- `GET /questionnaire?template=cv_1` - Get questionnaire for selected template
- `POST /generate-cv` - Generate resume with provided data

## Technologies Used

### Frontend
- React 18
- Material-UI (MUI)
- React Router
- Axios

### Backend
- Flask
- Google Gemini AI
- Flask-CORS

## Project Structure

```
CV_builder/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── Templates/            # HTML templates
│   ├── cv_1.html
│   └── cv_2.html
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

## Customization

### Adding New Templates
1. Create a new HTML template in the `Templates/` directory
2. Add the template to the `templates` array in `TemplateSelection.js`
3. The backend will automatically detect new templates

### Modifying Form Fields
Edit the form structure in `ResumeBuilder.js` to add, remove, or modify form fields.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the Flask backend is running and CORS is enabled
2. **API Key Issues**: Verify your Gemini API key is correctly set in the `.env` file
3. **Port Conflicts**: Make sure ports 3000 (React) and 5000 (Flask) are available

### Getting Help
- Check the browser console for frontend errors
- Check the Flask server logs for backend errors
- Ensure all dependencies are properly installed

## License

This project is open source and available under the MIT License.
