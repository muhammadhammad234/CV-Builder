import requests
import json

def test_ats_endpoint():
    """Test the ATS analyze endpoint with a simple request."""
    
    # Test data
    test_data = {
        'job_description': 'Software Engineer with Python, JavaScript, and React experience. Must have 3+ years of experience in web development.',
        'analysis_type': 'match'
    }
    
    # Create a simple text file to simulate PDF
    with open('test_resume.txt', 'w') as f:
        f.write("""
John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5 years of experience in Python, JavaScript, and React development.

SKILLS
- Python, JavaScript, React, Node.js
- Web Development, API Development
- Database Design, SQL, MongoDB
- Git, Docker, AWS

EXPERIENCE
Senior Software Engineer | Tech Company | 2020-2023
- Developed web applications using React and Python
- Built RESTful APIs and microservices
- Led team of 3 developers

Software Engineer | Startup | 2018-2020
- Full-stack development with JavaScript and Python
- Database design and optimization
- Agile development practices

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2018
        """)
    
    # Test the endpoint
    try:
        with open('test_resume.txt', 'rb') as f:
            files = {'pdf_file': ('test_resume.txt', f, 'text/plain')}
            data = {
                'job_description': test_data['job_description'],
                'analysis_type': test_data['analysis_type']
            }
            
            response = requests.post(
                'http://localhost:5001/ats-analyze',
                files=files,
                data=data,
                timeout=30
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ ATS Analysis successful!")
                print(f"Response length: {len(result.get('response', ''))}")
                print("First 200 characters of response:")
                print(result.get('response', '')[:200] + "...")
            else:
                print("❌ ATS Analysis failed!")
                print(f"Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
    
    # Clean up
    import os
    if os.path.exists('test_resume.txt'):
        os.remove('test_resume.txt')

if __name__ == "__main__":
    test_ats_endpoint()

