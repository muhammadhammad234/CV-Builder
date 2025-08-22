import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
    Fade,
    Slide,
    Zoom,
    Grow
} from '@mui/material';
import { Download, Print, ArrowBack, Fullscreen, FullscreenExit, CheckCircle, Star } from '@mui/icons-material';

const ResumePreview = () => {
    const navigate = useNavigate();
    const [resumeHtml, setResumeHtml] = useState('');
    const [loading, setLoading] = useState(true);
    const [fullscreen, setFullscreen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const html = localStorage.getItem('generatedResume');
        if (html) {
            // Clean the HTML content to remove any extra quotes or formatting
            let cleanedHtml = html;

            // Remove surrounding quotes if they exist
            if (cleanedHtml.startsWith('"') && cleanedHtml.endsWith('"')) {
                cleanedHtml = cleanedHtml.slice(1, -1);
            }
            if (cleanedHtml.startsWith("'") && cleanedHtml.endsWith("'")) {
                cleanedHtml = cleanedHtml.slice(1, -1);
            }

            // Remove any markdown code block formatting - more robust approach
            // Handle ```html at the beginning
            if (cleanedHtml.includes('```html')) {
                const startIndex = cleanedHtml.indexOf('```html') + 7;
                const endIndex = cleanedHtml.lastIndexOf('```');
                if (endIndex > startIndex) {
                    cleanedHtml = cleanedHtml.substring(startIndex, endIndex);
                }
            }
            // Handle ``` at the beginning (without html)
            else if (cleanedHtml.startsWith('```')) {
                const startIndex = cleanedHtml.indexOf('```') + 3;
                const endIndex = cleanedHtml.lastIndexOf('```');
                if (endIndex > startIndex) {
                    cleanedHtml = cleanedHtml.substring(startIndex, endIndex);
                }
            }

            // Trim whitespace
            cleanedHtml = cleanedHtml.trim();

            console.log('Original HTML:', html.substring(0, 100) + '...');
            console.log('Cleaned HTML:', cleanedHtml.substring(0, 100) + '...');

            setResumeHtml(cleanedHtml);
        } else {
            setError('No resume found. Please generate a resume first.');
        }
        setLoading(false);
    }, []);

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([resumeHtml], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = 'resume.html';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>Resume</title>
          <style>
            body { margin: 0; padding: 20px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${resumeHtml}
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={() => navigate('/')}>
                    Back to Templates
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth={fullscreen ? false : 'lg'} sx={{ py: 4 }}>
            <Fade in timeout={800}>
                <Box mb={4}>
                    <Slide direction="down" in timeout={600}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h3" component="h1" sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Resume Preview
                            </Typography>
                            <Box>
                                <Tooltip title="Toggle fullscreen">
                                    <IconButton
                                        onClick={toggleFullscreen}
                                        sx={{
                                            mr: 1,
                                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(25, 118, 210, 0.2)',
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {fullscreen ? <FullscreenExit /> : <Fullscreen />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Print resume">
                                    <IconButton
                                        onClick={handlePrint}
                                        sx={{
                                            mr: 1,
                                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Print />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download HTML">
                                    <IconButton
                                        onClick={handleDownload}
                                        sx={{
                                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Download />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Slide>

                    <Zoom in timeout={800}>
                        <Box display="flex" gap={2} flexWrap="wrap" sx={{ mb: 3 }}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={() => navigate('/builder')}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Back to Builder
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Download />}
                                onClick={handleDownload}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #ff9800, #ff5722)',
                                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #f57c00, #e64a19)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Download Resume
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Print />}
                                onClick={handlePrint}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #388e3c, #689f38)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Print Resume
                            </Button>
                        </Box>
                    </Zoom>
                </Box>
            </Fade>

            <Grow in timeout={1000}>
                <Paper
                    elevation={6}
                    sx={{
                        overflow: 'hidden',
                        maxHeight: fullscreen ? 'calc(100vh - 200px)' : '800px',
                        overflowY: 'auto',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <div
                        dangerouslySetInnerHTML={{ __html: resumeHtml }}
                        style={{
                            padding: '30px',
                            backgroundColor: 'white',
                            minHeight: '100%'
                        }}
                    />
                </Paper>
            </Grow>

            <Fade in timeout={1200}>
                <Box mt={4} textAlign="center">
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                    }}>
                        <CheckCircle sx={{
                            fontSize: 30,
                            color: '#4caf50',
                            mr: 1
                        }} />
                        <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                            Resume Generated Successfully!
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Your professional resume has been created. You can download it as HTML or print it directly.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                        <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                        <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                        <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                        <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                    </Box>
                </Box>
            </Fade>
        </Container>
    );
};

export default ResumePreview;
