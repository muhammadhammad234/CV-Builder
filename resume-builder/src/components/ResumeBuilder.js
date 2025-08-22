import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Grid,
    IconButton,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Fade,
    Slide,
    Zoom,
    Grow,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Add, Delete, Visibility, CheckCircle, ArrowBack, Description } from '@mui/icons-material';
import axios from 'axios';
import config from '../config';

const ResumeBuilder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedTemplate = location.state?.selectedTemplate || 'cv_1';

    const [formData, setFormData] = useState({
        personal_info: {
            full_name: '',
            email: '',
            phone: '',
            address: '',
            linkedin: '',
            portfolio: ''
        },
        summary: {
            summary_text: ''
        },
        education: [{
            degree: '',
            university: '',
            graduation_year: '',
            gpa: ''
        }],
        experience: [{
            job_title: '',
            company: '',
            start_date: '',
            end_date: '',
            currently_working: false,
            responsibilities: ''
        }],
        skills: {
            technical_skills: '',
            soft_skills: '',
            frameworks: '',
            tools: '',
            languages: ''
        },
        courses: {
            relevant_courses: ''
        },
        certifications: [{
            cert_name: '',
            issuer: '',
            year: ''
        }],
        projects: [{
            project_title: '',
            description: '',
            technologies: ''
        }],
        'awards/achievements': [{
            award_title: '',
            award_year: ''
        }],
        languages: {
            language: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (section, field, value, index = null) => {
        setFormData(prev => {
            const newData = { ...prev };
            if (index !== null) {
                // Handle array fields (education, experience, etc.)
                newData[section] = [...newData[section]];
                newData[section][index] = { ...newData[section][index], [field]: value };
            } else {
                // Handle single fields
                newData[section] = { ...newData[section], [field]: value };
            }
            return newData;
        });
    };

    const addItem = (section) => {
        const defaultItems = {
            education: { degree: '', university: '', graduation_year: '', gpa: '' },
            experience: { job_title: '', company: '', start_date: '', end_date: '', currently_working: false, responsibilities: '' },
            certifications: { cert_name: '', issuer: '', year: '' },
            projects: { project_title: '', description: '', technologies: '' },
            'awards/achievements': { award_title: '', award_year: '' }
        };

        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], defaultItems[section]]
        }));
    };

    const removeItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const handleGenerateResume = async () => {
        setLoading(true);
        setError('');

        try {
            // Validate form data
            console.log('=== RESUME GENERATION STARTED ===');
            console.log('Selected Template:', selectedTemplate);
            console.log('Form Data:', JSON.stringify(formData, null, 2));

            // Check if required fields are filled
            const requiredFields = ['full_name', 'email'];
            const missingFields = requiredFields.filter(field => !formData.personal_info[field]);

            if (missingFields.length > 0) {
                setError(`Please fill in required fields: ${missingFields.join(', ')}`);
                console.error('Missing required fields:', missingFields);
                return;
            }

            // Prepare request payload
            const payload = {
                template: selectedTemplate,
                questionnaire: formData
            };

            console.log('Sending request to backend...');
            console.log('Request URL:', `${config.BACKEND_URL}${config.ENDPOINTS.GENERATE_CV}`);
            console.log('Request Payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post(`${config.BACKEND_URL}${config.ENDPOINTS.GENERATE_CV}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: config.API_TIMEOUT
            });

            console.log('=== BACKEND RESPONSE RECEIVED ===');
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);
            console.log('Response Data Type:', typeof response.data);
            console.log('Response Data Length:', response.data ? response.data.length : 0);
            console.log('Response Data Preview:', response.data ? response.data.substring(0, 200) + '...' : 'No data');

            if (response.data && typeof response.data === 'string' && response.data.length > 100) {
                // Store the generated HTML in localStorage for preview
                localStorage.setItem('generatedResume', response.data);
                localStorage.setItem('selectedTemplate', selectedTemplate);
                console.log('✅ Resume data stored successfully');
                console.log('Navigating to preview page...');
                navigate('/preview');
            } else {
                console.error('❌ Invalid response data received');
                console.error('Response data:', response.data);
                setError('Invalid response from server. Please try again.');
            }
        } catch (err) {
            console.error('=== ERROR GENERATING RESUME ===');
            console.error('Error type:', err.constructor.name);
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);

            if (err.response) {
                // Server responded with error status
                console.error('Response status:', err.response.status);
                console.error('Response data:', err.response.data);
                console.error('Response headers:', err.response.headers);

                setError(`Server error (${err.response.status}): ${err.response.data || 'Unknown server error'}`);
            } else if (err.request) {
                // Request was made but no response received
                console.error('No response received from server');
                console.error('Request details:', err.request);

                setError(`Network error: Cannot connect to server. Please ensure the backend is running on ${config.BACKEND_URL}`);
            } else {
                // Something else happened
                console.error('Request setup error:', err.message);
                setError(`Request failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
            console.log('=== RESUME GENERATION COMPLETED ===');
        }
    };

    const renderField = (section, field, label, type = 'text', index = null) => {
        const isTextarea = type === 'textarea';
        const isDate = type === 'date';

        return (
            <TextField
                fullWidth
                label={label}
                type={isDate ? 'date' : 'text'}
                multiline={isTextarea}
                rows={isTextarea ? 4 : undefined}
                value={index !== null ? formData[section][index][field] : formData[section][field]}
                onChange={(e) => handleInputChange(section, field, e.target.value, index)}
                margin="normal"
                variant="outlined"
                helperText={isTextarea ? (section === 'skills' ? "List your skills (comma separated)" : "List key responsibilities and achievements (optional - AI will generate if missing)") : undefined}
                InputLabelProps={isDate ? { shrink: true } : undefined}
                sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                        width: '100%',
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

    // Helper function to get proper section titles
    const getSectionTitle = (section) => {
        const titleMap = {
            'education': 'Education',
            'experience': 'Work Experience',
            'certifications': 'Certifications',
            'projects': 'Projects',
            'awards/achievements': 'Awards & Achievements'
        };
        return titleMap[section] || section.charAt(0).toUpperCase() + section.slice(1);
    };

    const renderExperienceSection = () => (
        <Grow in timeout={600}>
            <Paper sx={{
                p: 3,
                mb: 3,
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)' }}>
                        Work Experience
                    </Typography>
                    <Button
                        startIcon={<Add />}
                        onClick={() => addItem('experience')}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.3)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        Add Work Experience
                    </Button>
                </Box>

                {formData.experience.map((item, index) => (
                    <Slide direction="up" in timeout={400 + index * 100} key={index}>
                        <Card sx={{
                            mb: 3,
                            position: 'relative',
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                background: 'rgba(255, 255, 255, 0.08)'
                            }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)' }}>
                                        Work Experience #{index + 1}
                                    </Typography>
                                    {formData.experience.length > 1 && (
                                        <IconButton
                                            onClick={() => removeItem('experience', index)}
                                            size="medium"
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'rgba(255, 255, 255, 1)',
                                                    transform: 'scale(1.1)'
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>

                                {/* First Row - 2 fields */}
                                <Grid container spacing={3} sx={{ mb: 3, display: 'flex' }}>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('experience', 'job_title', 'Job Title', 'text', index)}
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('experience', 'company', 'Company', 'text', index)}
                                    </Grid>
                                </Grid>

                                {/* Second Row - 2 fields */}
                                <Grid container spacing={3} sx={{ mb: 3, display: 'flex' }}>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('experience', 'start_date', 'Start Date', 'date', index)}
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {!item.currently_working ? (
                                            renderField('experience', 'end_date', 'End Date', 'date', index)
                                        ) : (
                                            <Box sx={{
                                                mt: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                textAlign: 'center'
                                            }}>
                                                <Typography variant="body2" sx={{
                                                    color: 'rgba(255,255,255,0.7)',
                                                    fontStyle: 'italic'
                                                }}>
                                                    Currently working - No end date needed
                                                </Typography>
                                            </Box>
                                        )}
                                        <Box sx={{ mt: 1, mb: 1 }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={item.currently_working}
                                                        onChange={(e) => handleInputChange('experience', 'currently_working', e.target.checked, index)}
                                                        icon={<CheckCircle />}
                                                        checkedIcon={<CheckCircle />}
                                                        size="small"
                                                        sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 18,
                                                                color: 'rgba(255,255,255,0.8)'
                                                            },
                                                            '&.Mui-checked .MuiSvgIcon-root': {
                                                                color: 'rgba(255,255,255,1)'
                                                            },
                                                            '&:hover .MuiSvgIcon-root': {
                                                                color: 'rgba(255,255,255,1)'
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 500,
                                                        color: 'rgba(255,255,255,0.9)',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        Currently working here
                                                    </Typography>
                                                }
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Third Row - 1 field (full width) */}
                                <Grid container spacing={3} sx={{ display: 'flex' }}>
                                    <Grid item xs={12} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('experience', 'responsibilities', 'Responsibilities/Achievements', 'textarea', index)}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Slide>
                ))}
            </Paper>
        </Grow>
    );

    const renderArraySection = (section, title, fields) => (
        <Grow in timeout={600}>
            <Paper sx={{
                p: 3,
                mb: 3,
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)' }}>
                        {getSectionTitle(section)}
                    </Typography>
                    <Button
                        startIcon={<Add />}
                        onClick={() => addItem(section)}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.3)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        Add {getSectionTitle(section)}
                    </Button>
                </Box>

                {formData[section].map((item, index) => (
                    <Slide direction="up" in timeout={400 + index * 100} key={index}>
                        <Card sx={{
                            mb: 3,
                            position: 'relative',
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                background: 'rgba(255, 255, 255, 0.08)'
                            }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)' }}>
                                        {getSectionTitle(section)} #{index + 1}
                                    </Typography>
                                    {formData[section].length > 1 && (
                                        <IconButton
                                            onClick={() => removeItem(section, index)}
                                            size="medium"
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'rgba(255, 255, 255, 1)',
                                                    transform: 'scale(1.1)'
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>

                                <Grid container spacing={3} sx={{ display: 'flex' }}>
                                    {fields.map((field) => (
                                        <Grid item xs={12} md={field.width || 12} key={field.name} sx={{ flex: 1, minWidth: 0 }}>
                                            {renderField(
                                                section,
                                                field.name,
                                                field.label,
                                                field.type || 'text',
                                                index
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Slide>
                ))}
            </Paper>
        </Grow>
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'transparent',
            py: 4,
            px: 2,
            position: 'relative'
        }}>
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Fade in timeout={800}>
                    <Box textAlign="center" mb={6}>
                        <Slide direction="down" in timeout={600}>
                            <Typography variant="h3" component="h1" gutterBottom sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2,
                                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}>
                                ✨ Build Your Resume ✨
                            </Typography>
                        </Slide>
                        <Slide direction="up" in timeout={800}>
                            <Typography variant="h6" sx={{
                                mb: 3,
                                color: 'rgba(255,255,255,0.95)',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                fontSize: '1.2rem',
                                fontWeight: 300
                            }}>
                                🌟 Create a stunning professional resume with our beautiful dark interface
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

                <Grid container spacing={4} sx={{ width: '100%', justifyContent: 'center' }}>
                    <Grid item xs={12}>
                        {/* Personal Information */}
                        <Grow in timeout={600}>
                            <Paper sx={{
                                p: 4,
                                mb: 4,
                                borderRadius: 3,
                                background: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: 'white',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                            }}>
                                <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    Personal Information
                                </Typography>
                                {/* First Row - 2 fields */}
                                <Grid container spacing={3} sx={{ mb: 3, width: '100%', display: 'flex' }}>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('personal_info', 'full_name', 'Full Name')}
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('personal_info', 'email', 'Email', 'email')}
                                    </Grid>
                                </Grid>

                                {/* Second Row - 2 fields */}
                                <Grid container spacing={3} sx={{ mb: 3, width: '100%', display: 'flex' }}>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('personal_info', 'phone', 'Phone Number')}
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('personal_info', 'address', 'Address')}
                                    </Grid>
                                </Grid>

                                {/* Third Row - 2 fields */}
                                <Grid container spacing={3} sx={{ mb: 3, width: '100%', display: 'flex' }}>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('personal_info', 'linkedin', 'LinkedIn Profile (Optional)')}
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('personal_info', 'portfolio', 'Portfolio/Website (Optional)')}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grow>

                        {/* Professional Summary */}
                        <Grow in timeout={700}>
                            <Paper sx={{
                                p: 4,
                                mb: 4,
                                borderRadius: 3,
                                background: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                            }}>
                                <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    Professional Summary
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Professional Summary"
                                    multiline
                                    rows={4}
                                    value={formData.summary.summary_text}
                                    onChange={(e) => handleInputChange('summary', 'summary_text', e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                    helperText="Write a brief professional summary (optional - will be generated if not provided)"
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
                            </Paper>
                        </Grow>

                        {/* Education */}
                        {renderArraySection('education', 'Education', [
                            { name: 'degree', label: 'Degree', width: 6 },
                            { name: 'university', label: 'University/College', width: 6 },
                            { name: 'graduation_year', label: 'Graduation Year', width: 6 },
                            { name: 'gpa', label: 'GPA (Optional)', width: 6 }
                        ])}

                        {/* Experience */}
                        {renderExperienceSection()}

                        {/* Skills */}
                        <Grow in timeout={800}>
                            <Paper sx={{
                                p: 4,
                                mb: 4,
                                borderRadius: 3,
                                background: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                            }}>
                                <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    💼 Skills & Expertise
                                </Typography>

                                {/* First Row - 2 fields */}
                                <Grid container spacing={3} sx={{ mb: 3, display: 'flex' }}>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('skills', 'technical_skills', 'Technical Skills', 'textarea')}
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('skills', 'soft_skills', 'Soft Skills (Optional)', 'textarea')}
                                    </Grid>
                                </Grid>

                                {/* Second Row - 2 fields */}
                                <Grid container spacing={3} sx={{ mb: 3, display: 'flex' }}>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('skills', 'frameworks', 'Frameworks & Libraries', 'textarea')}
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('skills', 'tools', 'Tools & Technologies', 'textarea')}
                                    </Grid>
                                </Grid>

                                {/* Third Row - 1 field (full width) */}
                                <Grid container spacing={3} sx={{ display: 'flex' }}>
                                    <Grid item xs={12} sx={{ flex: 1, minWidth: 0 }}>
                                        {renderField('skills', 'languages', 'Programming Languages', 'textarea')}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grow>

                        {/* Certifications */}
                        {renderArraySection('certifications', 'Certifications', [
                            { name: 'cert_name', label: 'Certification Name', width: 6 },
                            { name: 'issuer', label: 'Issuing Organization', width: 6 },
                            { name: 'year', label: 'Year Earned', width: 6 }
                        ])}

                        {/* Projects */}
                        {renderArraySection('projects', 'Projects', [
                            { name: 'project_title', label: 'Project Title', width: 6 },
                            { name: 'technologies', label: 'Technologies Used', width: 6 },
                            { name: 'description', label: 'Project Description', width: 12, type: 'textarea' }
                        ])}

                        {/* Awards/Achievements */}
                        {renderArraySection('awards/achievements', 'Awards & Achievements', [
                            { name: 'award_title', label: 'Award/Achievement', width: 6 },
                            { name: 'award_year', label: 'Year Received', width: 6 }
                        ])}

                        {/* Languages */}
                        <Grow in timeout={900}>
                            <Paper sx={{
                                p: 4,
                                mb: 4,
                                borderRadius: 3,
                                background: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                            }}>
                                <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    🗣️ Languages
                                </Typography>
                                {renderField('languages', 'language', 'Languages (e.g., English, Urdu)')}
                            </Paper>
                        </Grow>

                        {/* Courses */}
                        <Grow in timeout={1000}>
                            <Paper sx={{
                                p: 4,
                                mb: 4,
                                borderRadius: 3,
                                background: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                            }}>
                                <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    📚 Relevant Courses
                                </Typography>
                                {renderField('courses', 'relevant_courses', 'Relevant Courses or Certifications')}
                            </Paper>
                        </Grow>
                    </Grid>

                    {/* Resume Actions - Full Width */}
                    <Grid item xs={12}>
                        <Fade in timeout={1200}>
                            <Paper sx={{
                                px: 4,
                                py: 4,
                                borderRadius: 3,
                                background: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: 'white',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                height: 'fit-content',
                                width: '100%',
                                maxWidth: '1200px',
                                mx: 'auto'
                            }}>
                                {/* Header Section - Horizontal Layout */}
                                <Box sx={{ mb: 4, textAlign: 'center' }}>
                                    <Typography variant="h5" color="white" sx={{
                                        fontWeight: 'bold',
                                        mb: 2,
                                        background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: '1.4rem',
                                        letterSpacing: '0.05em'
                                    }}>
                                        🎯 Resume Actions
                                    </Typography>
                                    <Box sx={{
                                        width: 60,
                                        height: 3,
                                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                        borderRadius: 2,
                                        mx: 'auto'
                                    }} />
                                </Box>

                                {/* Staggered Actions Layout - Full Width */}
                                <Box sx={{ width: '100%' }}>
                                    {/* Top Section: Template Info, Form Completion, and Quick Tips */}
                                    <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                                        {/* Left Side - Template Info and Form Completion */}
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            flex: '0 0 40%'
                                        }}>
                                            {/* Row 1: Selected Template */}
                                            <Box sx={{
                                                p: 3,
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                borderRadius: 3,
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                textAlign: 'center',
                                                minHeight: '120px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}>
                                                <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 1, fontSize: '0.9rem' }}>
                                                    📄 Selected Template
                                                </Typography>
                                                <Typography variant="h6" color="white" sx={{
                                                    fontWeight: 'bold',
                                                    background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    {selectedTemplate === 'cv_1' ? '✨ Professional' : '🎨 Creative'}
                                                </Typography>
                                            </Box>

                                            {/* Row 2: Form Completion */}
                                            <Box sx={{
                                                p: 3,
                                                backgroundColor: 'rgba(255,255,255,0.08)',
                                                borderRadius: 3,
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                textAlign: 'center',
                                                minHeight: '120px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}>
                                                <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 2 }}>
                                                    📊 Form Completion
                                                </Typography>
                                                <Box sx={{
                                                    width: '100%',
                                                    height: 8,
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    borderRadius: 4,
                                                    overflow: 'hidden',
                                                    position: 'relative'
                                                }}>
                                                    <Box sx={{
                                                        width: '60%',
                                                        height: '100%',
                                                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                                        borderRadius: 4,
                                                        transition: 'width 0.3s ease'
                                                    }} />
                                                </Box>
                                                <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{
                                                    display: 'block',
                                                    mt: 1,
                                                    fontSize: '0.8rem'
                                                }}>
                                                    60% Complete
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Right Side - Quick Tips (takes remaining space) */}
                                        <Box sx={{
                                            p: 3,
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            borderRadius: 3,
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderLeft: '4px solid rgba(255,255,255,0.3)',
                                            flex: '0 0 60%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            px: 4
                                        }}>
                                            <Typography variant="h6" color="rgba(255,255,255,0.9)" sx={{
                                                fontWeight: 'bold',
                                                mb: 2,
                                                textAlign: 'center'
                                            }}>
                                                💡 Quick Tips
                                            </Typography>
                                            <Box component="ul" sx={{
                                                m: 0,
                                                pl: 0,
                                                listStyle: 'none',
                                                '& li': {
                                                    color: 'rgba(255,255,255,0.7)',
                                                    fontSize: '0.9rem',
                                                    mb: 1.5,
                                                    lineHeight: 1.5,
                                                    position: 'relative',
                                                    paddingLeft: '1.5rem',
                                                    '&:before': {
                                                        content: '"•"',
                                                        position: 'absolute',
                                                        left: '0.5rem',
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontWeight: 'bold'
                                                    }
                                                }
                                            }}>
                                                <li><strong>Fill required fields</strong> for best results</li>
                                                <li><strong>Use keywords</strong> from job descriptions</li>
                                                <li><strong>Keep descriptions</strong> concise and impactful</li>
                                                <li><strong>Review carefully</strong> before generating</li>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Bottom Section: All Buttons in One Row */}
                                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/template-selection')}
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
                                            Back to Templates
                                        </Button>

                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleGenerateResume}
                                            disabled={loading}
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Visibility />}
                                            sx={{
                                                flex: 2,
                                                py: 3,
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                backdropFilter: 'blur(10px)',
                                                border: '2px solid rgba(255,255,255,0.2)',
                                                borderRadius: 4,
                                                textTransform: 'none',
                                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
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
                                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
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
                                            {loading ? 'Generating...' : 'Generate CV'}
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/cover-letter-builder')}
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
                                            Cover Letter
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Fade>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ResumeBuilder;
