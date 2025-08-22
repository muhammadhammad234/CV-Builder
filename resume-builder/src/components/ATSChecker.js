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
    CheckCircle
} from '@mui/icons-material';
import axios from 'axios';
import config from '../config';

const ATSChecker = () => {
    const navigate = useNavigate();
    const [jobDescription, setJobDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
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

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('pdf_file', selectedFile);
            formData.append('job_description', jobDescription);
            formData.append('analysis_type', analysisType);

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

            setAnalysisResult({
                type: analysisType,
                response: response.data.response
            });
        } catch (err) {
            console.error('ATS Analysis Error:', err);
            if (err.response) {
                setError(`Analysis failed: ${err.response.data.error || 'Unknown error'}`);
            } else if (err.request) {
                setError('Network error: Cannot connect to server');
            } else {
                setError(`Request failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateResume = async () => {
        if (!jobDescription.trim()) {
            setError('Please enter a job description');
            return;
        }

        setLoading(true);
        setError('');

        try {
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

            if (response.data && typeof response.data === 'string') {
                localStorage.setItem('generatedResume', response.data);
                navigate('/preview');
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error('Resume Generation Error:', err);
            if (err.response) {
                setError(`Generation failed: ${err.response.data.error || 'Unknown error'}`);
            } else if (err.request) {
                setError('Network error: Cannot connect to server');
            } else {
                setError(`Request failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Container maxWidth={false} sx={{
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
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2,
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                            }}>
                                🔍 ATS Resume Checker
                            </Typography>
                        </Slide>
                        <Slide direction="up" in timeout={800}>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                                Upload your resume and analyze it against job descriptions for ATS compatibility
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
                    <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
                        {/* Input Section */}
                        <Grid item xs={12} lg={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grow in timeout={600}>
                                <Paper sx={{
                                    p: { xs: 2, sm: 3, md: 4 },
                                    borderRadius: 3,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
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
                                        sx={{ mb: 3, flex: 1 }}
                                    />

                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        📄 Upload Resume
                                    </Typography>

                                    <Box sx={{
                                        border: '2px dashed #ccc',
                                        borderRadius: 2,
                                        p: 3,
                                        textAlign: 'center',
                                        mb: 3,
                                        backgroundColor: selectedFile ? '#e8f5e8' : '#fafafa',
                                        borderColor: selectedFile ? '#4caf50' : '#ccc',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
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
                                                sx={{ mb: 2 }}
                                            >
                                                Choose PDF File
                                            </Button>
                                        </label>
                                        {selectedFile && (
                                            <Box sx={{ mt: 2 }}>
                                                <CheckCircle sx={{ color: '#4caf50', mr: 1 }} />
                                                <Typography variant="body2" color="text.secondary">
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
                                            background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #388e3c, #689f38)'
                                            }
                                        }}
                                    >
                                        Generate Resume from Job Description
                                    </Button>
                                </Paper>
                            </Grow>
                        </Grid>

                        {/* Analysis Options */}
                        <Grid item xs={12} lg={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grow in timeout={800}>
                                <Paper sx={{
                                    p: { xs: 2, sm: 3, md: 4 },
                                    borderRadius: 3,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        🔍 Analysis Options
                                    </Typography>

                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Grid container spacing={2} sx={{ flex: 1 }}>
                                            {analysisTypes.map((type) => (
                                                <Grid item xs={12} sm={6} key={type.id} sx={{ display: 'flex' }}>
                                                    <Card sx={{
                                                        width: '100%',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                        }
                                                    }}>
                                                        <CardContent sx={{
                                                            textAlign: 'center',
                                                            p: 2,
                                                            flex: 1,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Box sx={{ mb: 2 }}>
                                                                {type.icon}
                                                            </Box>
                                                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                                {type.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                                {type.description}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleAnalyze(type.id)}
                                                                disabled={loading || !selectedFile || !jobDescription.trim()}
                                                                sx={{
                                                                    background: type.color,
                                                                    '&:hover': {
                                                                        background: type.color,
                                                                        opacity: 0.8
                                                                    }
                                                                }}
                                                            >
                                                                {loading ? <CircularProgress size={16} /> : 'Analyze'}
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
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
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            width: '100%'
                        }}>
                            <Box display="flex" alignItems="center" mb={3}>
                                <Assessment sx={{ fontSize: 30, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Analysis Results
                                </Typography>
                                <Chip
                                    label={analysisTypes.find(t => t.id === analysisResult.type)?.title}
                                    color="white"
                                    sx={{ ml: 2 }}
                                />
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Box sx={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: 2,
                                p: 3,
                                maxHeight: '400px',
                                overflow: 'auto',
                                width: '100%'
                            }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {analysisResult.response}
                                </Typography>
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
                                textTransform: 'none'
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
