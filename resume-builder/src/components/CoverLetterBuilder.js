import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Grid,
    Alert,
    CircularProgress,
    Fade,
    Slide,
    Zoom,
    Grow
} from '@mui/material';
import { Description, Visibility, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import config from '../config';

const CoverLetterBuilder = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        job: {
            job_description: '',
            company: '',
            hr_name: '',
            date: ''
        },
        applicant: {
            name: '',
            designation: '',
            email: '',
            phone: '',
            address: '',
            past_experience: '',
            skills: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleGenerateCoverLetter = async () => {
        setLoading(true);
        setError('');

        try {
            console.log('=== COVER LETTER GENERATION STARTED ===');
            console.log('Form Data:', JSON.stringify(formData, null, 2));

            // Check if required fields are filled
            const requiredFields = {
                job: ['job_description', 'company'],
                applicant: ['name', 'designation', 'email']
            };

            const missingFields = [];
            Object.entries(requiredFields).forEach(([section, fields]) => {
                fields.forEach(field => {
                    if (!formData[section][field]) {
                        missingFields.push(`${section}.${field}`);
                    }
                });
            });

            if (missingFields.length > 0) {
                setError(`Please fill in required fields: ${missingFields.join(', ')}`);
                console.error('Missing required fields:', missingFields);
                return;
            }

            // Prepare request payload
            const payload = {
                template: 'cl',
                job: formData.job,
                applicant: formData.applicant
            };

            console.log('Sending request to backend...');
            console.log('Request URL:', `${config.BACKEND_URL}${config.ENDPOINTS.GENERATE_COVER_LETTER}`);
            console.log('Request Payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post(`${config.BACKEND_URL}${config.ENDPOINTS.GENERATE_COVER_LETTER}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: config.API_TIMEOUT
            });

            console.log('=== BACKEND RESPONSE RECEIVED ===');
            console.log('Response Status:', response.status);
            console.log('Response Data Type:', typeof response.data);
            console.log('Response Data Length:', response.data ? response.data.length : 0);
            console.log('Response Data Preview:', response.data ? response.data.substring(0, 200) + '...' : 'No data');

            if (response.data && typeof response.data === 'string' && response.data.length > 100) {
                // Store the generated HTML in localStorage for preview
                localStorage.setItem('generatedCoverLetter', response.data);
                console.log('✅ Cover letter data stored successfully');
                console.log('Navigating to preview page...');
                navigate('/cover-letter-preview');
            } else {
                console.error('❌ Invalid response data received');
                console.error('Response data:', response.data);
                setError('Invalid response from server. Please try again.');
            }
        } catch (err) {
            console.error('=== ERROR GENERATING COVER LETTER ===');
            console.error('Error type:', err.constructor.name);
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);

            if (err.response) {
                console.error('Response status:', err.response.status);
                console.error('Response data:', err.response.data);
                setError(`Server error (${err.response.status}): ${err.response.data || 'Unknown server error'}`);
            } else if (err.request) {
                console.error('No response received from server');
                setError(`Network error: Cannot connect to server. Please ensure the backend is running on ${config.BACKEND_URL}`);
            } else {
                console.error('Request setup error:', err.message);
                setError(`Request failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
            console.log('=== COVER LETTER GENERATION COMPLETED ===');
        }
    };

    const renderField = (section, field, label, type = 'text', multiline = false, rows = 1) => {
        return (
            <TextField
                fullWidth
                label={label}
                type={type}
                multiline={multiline}
                rows={rows}
                value={formData[section][field]}
                onChange={(e) => handleInputChange(section, field, e.target.value)}
                margin="normal"
                variant="outlined"
                InputLabelProps={type === 'date' ? { shrink: true } : undefined}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.3)'
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            border: '2px solid rgba(255,255,255,0.5)'
                        }
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                        '&.Mui-focused': {
                            color: 'rgba(255,255,255,0.9)'
                        }
                    },
                    '& .MuiInputBase-input': {
                        color: '#ffffff'
                    }
                }}
            />
        );
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Container maxWidth="xl" sx={{
                flex: 1,
                py: 4,
                px: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Fade in timeout={800}>
                    <Box textAlign="center" mb={4}>
                        <Slide direction="down" in timeout={600}>
                            <Typography variant="h3" component="h1" gutterBottom sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2,
                                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }
                            }}>
                                📝 Create Your Cover Letter 📝
                            </Typography>
                        </Slide>
                        <Slide direction="up" in timeout={800}>
                            <Typography variant="h6" sx={{
                                mb: 3,
                                color: 'rgba(255,255,255,0.95)',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                fontWeight: 300
                            }}>
                                🌟 Craft a compelling cover letter that showcases your skills and enthusiasm
                            </Typography>
                        </Slide>
                        <Zoom in timeout={1000}>
                            <Box sx={{
                                width: 80,
                                height: 4,
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                borderRadius: 2,
                                mx: 'auto'
                            }} />
                        </Zoom>
                    </Box>
                </Fade>

                {error && (
                    <Fade in timeout={300}>
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    </Fade>
                )}

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
                        <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                            {/* Job Information */}
                            <Grow in timeout={600}>
                                <Paper sx={{
                                    p: { xs: 2, sm: 3, md: 4 },
                                    mb: 3,
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                    flex: 1
                                }}>
                                    <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        💼 Job Information
                                    </Typography>

                                    <Grid container spacing={3}>
                                        {/* Row 1: Company Name */}
                                        <Grid item xs={12}>
                                            {renderField('job', 'company', 'Company Name')}
                                        </Grid>

                                        {/* Row 2: Application Date */}
                                        <Grid item xs={12}>
                                            {renderField('job', 'date', 'Application Date', 'date')}
                                        </Grid>

                                        {/* Row 3: HR Manager Name */}
                                        <Grid item xs={12}>
                                            {renderField('job', 'hr_name', 'HR Manager Name (Optional)')}
                                        </Grid>

                                        {/* Row 4-6: Job Description */}
                                        <Grid item xs={12}>
                                            {renderField('job', 'job_description', 'Job Description', 'text', true, 6)}
                                        </Grid>
                                    </Grid>



                                </Paper>
                            </Grow>

                            {/* Applicant Information */}
                            <Grow in timeout={700}>
                                <Paper sx={{
                                    p: { xs: 2, sm: 3, md: 4 },
                                    mb: 3,
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                    flex: 1
                                }}>
                                    <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        👤 Your Information
                                    </Typography>

                                    <Grid container spacing={3}>
                                        {/* Row 1: Full Name, Job Title/Designation */}
                                        <Grid item xs={12} md={6}>
                                            {renderField('applicant', 'name', 'Full Name')}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {renderField('applicant', 'designation', 'Job Title/Designation')}
                                        </Grid>

                                        {/* Row 2: Email Address, Phone Number, Home Address */}
                                        <Grid item xs={12} md={4}>
                                            {renderField('applicant', 'email', 'Email Address')}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            {renderField('applicant', 'phone', 'Phone Number')}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            {renderField('applicant', 'address', 'Home Address')}
                                        </Grid>

                                        {/* Row 3: Key Skills, Relevant Past Experience */}
                                        <Grid item xs={12} md={6}>
                                            {renderField('applicant', 'skills', 'Key Skills (comma separated)', 'text', true, 3)}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {renderField('applicant', 'past_experience', 'Relevant Past Experience', 'text', true, 4)}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grow>
                        </Grid>

                        {/* Sidebar */}
                        <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Fade in timeout={1200}>
                                <Paper sx={{
                                    p: { xs: 2, sm: 3, md: 4 },
                                    position: 'sticky',
                                    top: 20,
                                    borderRadius: 3,
                                    background: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: 'white',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                    height: 'fit-content'
                                }}>
                                    <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        Cover Letter Actions
                                    </Typography>

                                    <Box mb={3} sx={{
                                        p: 2,
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: 2,
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <Typography variant="body1" color="white" sx={{ fontWeight: 'bold' }}>
                                            Template: <strong>Professional Cover Letter</strong>
                                        </Typography>
                                    </Box>

                                    {/* Bottom Section: All Buttons in One Row */}
                                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/')}
                                            startIcon={<ArrowBack />}
                                            sx={{
                                                flex: 1,
                                                py: 2.5,
                                                borderColor: 'rgba(255,255,255,0.3)',
                                                color: 'rgba(255,255,255,0.9)',
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                backdropFilter: 'blur(10px)',
                                                borderWidth: '2px',
                                                '&:hover': {
                                                    borderColor: 'rgba(255,255,255,0.8)',
                                                    background: 'rgba(255,255,255,0.15)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                                    borderWidth: '2px'
                                                },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            Back to Tools
                                        </Button>

                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleGenerateCoverLetter}
                                            disabled={loading}
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Visibility />}
                                            sx={{
                                                flex: 2,
                                                py: 3,
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                                                backdropFilter: 'blur(10px)',
                                                border: '2px solid rgba(255,255,255,0.2)',
                                                borderRadius: 4,
                                                textTransform: 'none',
                                                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&:before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: '-100%',
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                                    transition: 'left 0.5s'
                                                },
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #8bc34a 0%, #4caf50 100%)',
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: '0 12px 40px rgba(76, 175, 80, 0.6)',
                                                    '&:before': {
                                                        left: '100%'
                                                    }
                                                },
                                                '&:disabled': {
                                                    background: 'rgba(255,255,255,0.1)',
                                                    color: 'rgba(255,255,255,0.5)',
                                                    transform: 'none',
                                                    boxShadow: 'none',
                                                    '&:before': {
                                                        display: 'none'
                                                    }
                                                },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            {loading ? 'Generating...' : 'Generate Cover Letter'}
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/template-selection')}
                                            startIcon={<Description />}
                                            sx={{
                                                flex: 1,
                                                py: 2.5,
                                                borderColor: 'rgba(255,255,255,0.3)',
                                                color: 'rgba(255,255,255,0.9)',
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                backdropFilter: 'blur(10px)',
                                                borderWidth: '2px',
                                                '&:hover': {
                                                    borderColor: 'rgba(255,255,255,0.8)',
                                                    background: 'rgba(255,255,255,0.15)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                                    borderWidth: '2px'
                                                },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            Build Resume
                                        </Button>
                                    </Box>
                                </Paper>
                            </Fade>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default CoverLetterBuilder;
