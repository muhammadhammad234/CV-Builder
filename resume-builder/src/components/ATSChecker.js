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
    Grow,
    Card,
    CardContent,
    CardActions,
    Chip,
    Divider
} from '@mui/material';
import {
    Upload,
    Assessment,
    TrendingUp,
    Edit,
    Description,
    ArrowBack,
    CheckCircle,
    Clear,
    Download
} from '@mui/icons-material';
import axios from 'axios';
import config from '../config';

const ATSChecker = () => {
    const navigate = useNavigate();
    const [jobDescription, setJobDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(null);
    const [error, setError] = useState('');

    const analysisTypes = [
        {
            id: 'match',
            title: 'ATS Score',
            description: 'Get your resume match percentage and missing keywords',
            icon: <Assessment sx={{ fontSize: 40, color: '#1976d2' }} />,
            color: '#1976d2'
        },
        {
            id: 'about',
            title: 'Resume Analysis',
            description: 'Detailed evaluation of your resume against the job',
            icon: <Description sx={{ fontSize: 40, color: '#4caf50' }} />,
            color: '#4caf50'
        },
        {
            id: 'improve',
            title: 'Improvement Tips',
            description: 'Get recommendations to enhance your skills',
            icon: <TrendingUp sx={{ fontSize: 40, color: '#ff9800' }} />,
            color: '#ff9800'
        },
        {
            id: 'tailor',
            title: 'Tailor Resume',
            description: 'Get a tailored version of your resume',
            icon: <Edit sx={{ fontSize: 40, color: '#e91e63' }} />,
            color: '#e91e63'
        }
    ];

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setError('');
        } else {
            setError('Please select a valid PDF file');
            setSelectedFile(null);
        }
    };

    const handleAnalyze = async (analysisType) => {
        if (!selectedFile || !jobDescription.trim()) {
            setError('Please upload a PDF resume and enter a job description');
            return;
        }

        setAnalysisLoading(analysisType);
        setError('');

        try {
            console.log('=== ATS ANALYSIS STARTED ===');
            console.log('Analysis Type:', analysisType);
            console.log('File:', selectedFile.name);
            console.log('Job Description Length:', jobDescription.length);

            const formData = new FormData();
            formData.append('pdf_file', selectedFile);
            formData.append('job_description', jobDescription);
            formData.append('analysis_type', analysisType);

            console.log('Sending request to backend...');
            console.log('Request URL:', `${config.BACKEND_URL}${config.ENDPOINTS.ATS_ANALYZE}`);

            const response = await axios.post(
                `${config.BACKEND_URL}${config.ENDPOINTS.ATS_ANALYZE}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: config.API_TIMEOUT
                }
            );

            console.log('=== BACKEND RESPONSE RECEIVED ===');
            console.log('Response Status:', response.status);
            console.log('Response Data Type:', typeof response.data);
            console.log('Response Data Length:', response.data ? response.data.response ? response.data.response.length : 0 : 0);

            if (response.data && response.data.response) {
                setAnalysisResult({
                    type: analysisType,
                    response: response.data.response
                });
                console.log('✅ Analysis result set successfully');
            } else {
                console.error('❌ Invalid response data received');
                setError('Invalid response from server. Please try again.');
            }
        } catch (err) {
            console.error('=== ERROR IN ATS ANALYSIS ===');
            console.error('Error type:', err.constructor.name);
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);

            if (err.response) {
                console.error('Response status:', err.response.status);
                console.error('Response data:', err.response.data);
                setError(`Analysis failed: ${err.response.data.error || 'Unknown server error'}`);
            } else if (err.request) {
                console.error('No response received from server');
                setError(`Network error: Cannot connect to server. Please ensure the backend is running on ${config.BACKEND_URL}`);
            } else {
                console.error('Request setup error:', err.message);
                setError(`Request failed: ${err.message}`);
            }
        } finally {
            setAnalysisLoading(null);
            console.log('=== ATS ANALYSIS COMPLETED ===');
        }
    };

    const clearResults = () => {
        setAnalysisResult(null);
        setError('');
    };

    const handleGenerateResume = async () => {
        if (!jobDescription.trim()) {
            setError('Please enter a job description');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('=== RESUME GENERATION STARTED ===');
            console.log('Job Description Length:', jobDescription.length);

            const response = await axios.post(
                `${config.BACKEND_URL}${config.ENDPOINTS.GENERATE_RESUME_FROM_JOB}`,
                { job_description: jobDescription },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: config.API_TIMEOUT
                }
            );

            console.log('=== BACKEND RESPONSE RECEIVED ===');
            console.log('Response Status:', response.status);
            console.log('Response Data Type:', typeof response.data);
            console.log('Response Data Length:', response.data ? response.data.length : 0);
            console.log('Response Data Preview:', response.data ? response.data.substring(0, 200) + '...' : 'No data');

            if (response.data && typeof response.data === 'string' && response.data.length > 100) {
                localStorage.setItem('generatedResume', response.data);
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
                console.error('Response status:', err.response.status);
                console.error('Response data:', err.response.data);
                setError(`Generation failed: ${err.response.data.error || 'Unknown server error'}`);
            } else if (err.request) {
                console.error('No response received from server');
                setError(`Network error: Cannot connect to server. Please ensure the backend is running on ${config.BACKEND_URL}`);
            } else {
                console.error('Request setup error:', err.message);
                setError(`Request failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
            console.log('=== RESUME GENERATION COMPLETED ===');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                zIndex: 0
            }
        }}>
            <Container maxWidth={false} sx={{
                flex: 1,
                py: 4,
                px: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 1
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
                                🔍 ATS Resume Checker 🔍
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
                                📊 Analyze your resume against job descriptions and get detailed insights
                            </Typography>
                        </Slide>
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
                    <Grid container spacing={0} sx={{
                        flex: 1,
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        '@media (min-width: 900px)': {
                            flexDirection: 'row'
                        }
                    }}>
                        {/* Analysis Options Section - Left Side */}
                        <Grid item xs={12} md={8} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: { xs: 'auto', md: '500px' },
                            width: { md: 'calc(65% - 8px)' },
                            flex: { md: '0 0 calc(65% - 8px)' },
                            mr: { md: 1 }
                        }}>
                            <Grow in timeout={800}>
                                <Paper sx={{
                                    p: { xs: 2, sm: 3, md: 4 },
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                                        🔍 Analysis Options
                                    </Typography>

                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        {/* Analysis Options Grid - 2x2 Layout */}
                                        <Grid container spacing={2} sx={{
                                            flex: 1,
                                            height: '100%',
                                            maxHeight: 'none',
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gridTemplateRows: '1fr 1fr',
                                            gap: 2
                                        }}>
                                            {/* ATS Score */}
                                            <Grid item sx={{ display: 'flex', flex: 1 }}>
                                                <Card sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    flex: 1,
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                                        background: 'rgba(255, 255, 255, 0.15)',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                                    }
                                                }}>
                                                    <CardContent sx={{
                                                        textAlign: 'center',
                                                        p: 2,
                                                        flex: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        color: 'white'
                                                    }}>
                                                        <Box sx={{ mb: 2 }}>
                                                            {analysisTypes[0].icon}
                                                        </Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                                                            {analysisTypes[0].title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                                                            {analysisTypes[0].description}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleAnalyze(analysisTypes[0].id)}
                                                            disabled={analysisLoading || !selectedFile || !jobDescription.trim()}
                                                            sx={{
                                                                background: analysisTypes[0].color,
                                                                '&:hover': {
                                                                    background: analysisTypes[0].color,
                                                                    opacity: 0.8
                                                                }
                                                            }}
                                                        >
                                                            {analysisLoading === analysisTypes[0].id ? <CircularProgress size={16} /> : 'Analyze'}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>

                                            {/* Resume Analysis */}
                                            <Grid item sx={{ display: 'flex', flex: 1 }}>
                                                <Card sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    flex: 1,
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                                        background: 'rgba(255, 255, 255, 0.15)',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                                    }
                                                }}>
                                                    <CardContent sx={{
                                                        textAlign: 'center',
                                                        p: 2,
                                                        flex: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        color: 'white'
                                                    }}>
                                                        <Box sx={{ mb: 2 }}>
                                                            {analysisTypes[1].icon}
                                                        </Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                                                            {analysisTypes[1].title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                                                            {analysisTypes[1].description}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleAnalyze(analysisTypes[1].id)}
                                                            disabled={analysisLoading || !selectedFile || !jobDescription.trim()}
                                                            sx={{
                                                                background: analysisTypes[1].color,
                                                                '&:hover': {
                                                                    background: analysisTypes[1].color,
                                                                    opacity: 0.8
                                                                }
                                                            }}
                                                        >
                                                            {analysisLoading === analysisTypes[1].id ? <CircularProgress size={16} /> : 'Analyze'}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>

                                            {/* Improvement Tips */}
                                            <Grid item sx={{ display: 'flex', flex: 1 }}>
                                                <Card sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    flex: 1,
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                                        background: 'rgba(255, 255, 255, 0.15)',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                                    }
                                                }}>
                                                    <CardContent sx={{
                                                        textAlign: 'center',
                                                        p: 2,
                                                        flex: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        color: 'white'
                                                    }}>
                                                        <Box sx={{ mb: 2 }}>
                                                            {analysisTypes[2].icon}
                                                        </Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                                                            {analysisTypes[2].title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                                                            {analysisTypes[2].description}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleAnalyze(analysisTypes[2].id)}
                                                            disabled={analysisLoading || !selectedFile || !jobDescription.trim()}
                                                            sx={{
                                                                background: analysisTypes[2].color,
                                                                '&:hover': {
                                                                    background: analysisTypes[2].color,
                                                                    opacity: 0.8
                                                                }
                                                            }}
                                                        >
                                                            {analysisLoading === analysisTypes[2].id ? <CircularProgress size={16} /> : 'Analyze'}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>

                                            {/* Tailor Resume */}
                                            <Grid item sx={{ display: 'flex', flex: 1 }}>
                                                <Card sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    flex: 1,
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                                        background: 'rgba(255, 255, 255, 0.15)',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                                    }
                                                }}>
                                                    <CardContent sx={{
                                                        textAlign: 'center',
                                                        p: 2,
                                                        flex: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        color: 'white'
                                                    }}>
                                                        <Box sx={{ mb: 2 }}>
                                                            {analysisTypes[3].icon}
                                                        </Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                                                            {analysisTypes[3].title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                                                            {analysisTypes[3].description}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleAnalyze(analysisTypes[3].id)}
                                                            disabled={analysisLoading || !selectedFile || !jobDescription.trim()}
                                                            sx={{
                                                                background: analysisTypes[3].color,
                                                                '&:hover': {
                                                                    background: analysisTypes[3].color,
                                                                    opacity: 0.8
                                                                }
                                                            }}
                                                        >
                                                            {analysisLoading === analysisTypes[3].id ? <CircularProgress size={16} /> : 'Analyze'}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Grow>
                        </Grid>

                        {/* Job Description Section - Right Side */}
                        <Grid item xs={12} md={4} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: { xs: 'auto', md: '500px' },
                            width: { md: 'calc(35% - 8px)' },
                            flex: { md: '0 0 calc(35% - 8px)' },
                            ml: { md: 1 }
                        }}>
                            <Grow in timeout={600}>
                                <Paper sx={{
                                    p: { xs: 2, sm: 3, md: 4 },
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                                        📋 Job Description
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={8}
                                        label="Paste the job description here"
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        variant="outlined"
                                        sx={{
                                            mb: 3,
                                            flex: 1,
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

                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                                        📄 Upload Resume
                                    </Typography>

                                    <Box sx={{
                                        border: '2px dashed rgba(255,255,255,0.3)',
                                        borderRadius: 2,
                                        p: 3,
                                        textAlign: 'center',
                                        mb: 3,
                                        backgroundColor: selectedFile ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.1)',
                                        borderColor: selectedFile ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255,255,255,0.3)',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <input
                                            accept=".pdf"
                                            style={{ display: 'none' }}
                                            id="resume-upload"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="resume-upload">
                                            <Button
                                                component="span"
                                                variant="outlined"
                                                startIcon={<Upload />}
                                                sx={{
                                                    mb: 2,
                                                    borderColor: 'rgba(255,255,255,0.3)',
                                                    color: 'rgba(255,255,255,0.9)',
                                                    '&:hover': {
                                                        borderColor: 'rgba(255,255,255,0.8)',
                                                        background: 'rgba(255,255,255,0.15)'
                                                    }
                                                }}
                                            >
                                                Choose PDF File
                                            </Button>
                                        </label>
                                        {selectedFile && (
                                            <Box sx={{ mt: 2 }}>
                                                <CheckCircle sx={{ color: '#4caf50', mr: 1 }} />
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                    {selectedFile.name}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={handleGenerateResume}
                                        disabled={loading || !jobDescription.trim()}
                                        startIcon={loading ? <CircularProgress size={20} /> : <Description />}
                                        sx={{
                                            py: 1.5,
                                            fontSize: '1.1rem',
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
                                        Generate Resume from Job Description
                                    </Button>
                                </Paper>
                            </Grow>
                        </Grid>
                    </Grid>
                </Box>

                {/* Analysis Results */}
                {analysisResult && (
                    <Grow in timeout={1000}>
                        <Paper sx={{
                            p: { xs: 2, sm: 3, md: 4 },
                            mt: 3,
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: 'white',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                            width: '100%'
                        }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                                <Box display="flex" alignItems="center">
                                    <Assessment sx={{ fontSize: 30, color: '#1976d2', mr: 2 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        Analysis Results
                                    </Typography>
                                    <Chip
                                        label={analysisTypes.find(t => t.id === analysisResult.type)?.title}
                                        color="primary"
                                        sx={{ ml: 2 }}
                                    />
                                </Box>
                                <Box display="flex" gap={1}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={clearResults}
                                        startIcon={<Clear />}
                                        sx={{
                                            borderRadius: 2,
                                            borderColor: 'rgba(255,255,255,0.3)',
                                            color: 'rgba(255,255,255,0.9)',
                                            '&:hover': {
                                                borderColor: 'rgba(255,255,255,0.8)',
                                                background: 'rgba(255,255,255,0.15)'
                                            }
                                        }}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            const blob = new Blob([analysisResult.response], { type: 'text/html' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `ats-analysis-${analysisResult.type}.html`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            URL.revokeObjectURL(url);
                                        }}
                                        startIcon={<Download />}
                                        sx={{
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                                            }
                                        }}
                                    >
                                        Download
                                    </Button>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Box sx={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: 2,
                                p: 3,
                                maxHeight: '400px',
                                overflow: 'auto',
                                width: '100%',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                '& h1, & h2, & h3, & h4, & h5, & h6': {
                                    textAlign: 'left !important',
                                    color: 'white !important'
                                },
                                '& p': {
                                    textAlign: 'left !important',
                                    color: 'white !important'
                                },
                                '& ul, & ol': {
                                    textAlign: 'left !important',
                                    color: 'white !important'
                                },
                                '& li': {
                                    textAlign: 'left !important',
                                    color: 'white !important'
                                },
                                '& div': {
                                    textAlign: 'left !important',
                                    color: 'white !important'
                                }
                            }}>
                                <div
                                    dangerouslySetInnerHTML={{ __html: analysisResult.response }}
                                    style={{
                                        fontFamily: 'Arial, sans-serif',
                                        lineHeight: '1.6',
                                        color: 'white',
                                        textAlign: 'left'
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Grow>
                )}

                {/* Navigation */}
                <Fade in timeout={1200}>
                    <Box textAlign="center" mt={3}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            startIcon={<ArrowBack />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 2,
                                textTransform: 'none',
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'rgba(255,255,255,0.9)',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.8)',
                                    background: 'rgba(255,255,255,0.15)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            Back to Tools
                        </Button>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default ATSChecker;
