import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Alert,
    Fade,
    Slide,
    Grow
} from '@mui/material';
import { Download, ArrowBack, Print, Edit, CheckCircle, Star } from '@mui/icons-material';

const CoverLetterPreview = () => {
    const navigate = useNavigate();
    const [coverLetterHtml, setCoverLetterHtml] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedCoverLetter = localStorage.getItem('generatedCoverLetter');
        if (storedCoverLetter) {
            // Clean the HTML content to remove any extra quotes or formatting
            let cleanedHtml = storedCoverLetter;

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

            console.log('Original Cover Letter HTML:', storedCoverLetter.substring(0, 100) + '...');
            console.log('Cleaned Cover Letter HTML:', cleanedHtml.substring(0, 100) + '...');

            setCoverLetterHtml(cleanedHtml);
        } else {
            setError('No cover letter found. Please generate a cover letter first.');
        }
    }, []);

    const handleDownload = () => {
        try {
            // Create a blob from the HTML content
            const blob = new Blob([coverLetterHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = 'cover-letter.html';

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading cover letter:', err);
            setError('Failed to download cover letter. Please try again.');
        }
    };

    const handlePrint = () => {
        try {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Cover Letter</title>
                        <style>
                            body { margin: 0; padding: 20px; }
                            @media print {
                                body { padding: 0; }
                            }
                        </style>
                    </head>
                    <body>
                        ${coverLetterHtml}
                    </body>
                </html>
            `);
            printWindow.document.close();

            // Wait for content to load then print
            printWindow.onload = () => {
                printWindow.print();
                printWindow.close();
            };
        } catch (err) {
            console.error('Error printing cover letter:', err);
            setError('Failed to print cover letter. Please try again.');
        }
    };

    const handleEdit = () => {
        // Keep the form data in localStorage for pre-filling
        // The CoverLetterBuilder will load it automatically
        navigate('/cover-letter-builder');
    };

    if (error) {
        return (
            <Box sx={{
                minHeight: '100vh',
                width: '100%',
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
                    pointerEvents: 'none'
                }
            }}>
                <Container maxWidth="lg" sx={{
                    py: 4,
                    position: 'relative',
                    zIndex: 1
                }}>
                    <Fade in timeout={300}>
                        <Alert severity="error" sx={{
                            mb: 3,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            {error}
                        </Alert>
                    </Fade>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/cover-letter-builder')}
                        startIcon={<ArrowBack />}
                        sx={{
                            borderRadius: 3,
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            borderWidth: '2px',
                            '&:hover': {
                                borderColor: 'rgba(255,255,255,0.8)',
                                background: 'rgba(255,255,255,0.15)'
                            }
                        }}
                    >
                        Back to Cover Letter Builder
                    </Button>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
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
                pointerEvents: 'none'
            }
        }}>
            <Container maxWidth="lg" sx={{
                py: 4,
                position: 'relative',
                zIndex: 1
            }}>
                <Fade in timeout={800}>
                    <Box mb={4}>
                        <Slide direction="down" in timeout={600}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h3" component="h1" sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }
                                }}>
                                    📄 Cover Letter Preview
                                </Typography>
                            </Box>
                        </Slide>
                        <Slide direction="up" in timeout={800}>
                            <Typography variant="h6" sx={{
                                mb: 3,
                                color: 'rgba(255,255,255,0.95)',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                fontWeight: 300
                            }}>
                                Review your generated cover letter and download or print it
                            </Typography>
                        </Slide>
                    </Box>
                </Fade>

                {/* Action Buttons */}
                <Fade in timeout={1200}>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleDownload}
                            startIcon={<Download />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 8px 32px rgba(255, 152, 0, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #f57c00 0%, #e64a19 100%)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 12px 40px rgba(255, 152, 0, 0.6)',
                                    border: '2px solid rgba(255,255,255,0.3)'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            Download Cover Letter
                        </Button>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handlePrint}
                            startIcon={<Print />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #388e3c 0%, #689f38 100%)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 12px 40px rgba(76, 175, 80, 0.6)',
                                    border: '2px solid rgba(255,255,255,0.3)'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            Print Cover Letter
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleEdit}
                            startIcon={<Edit />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                textTransform: 'none',
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                borderWidth: '2px',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.8)',
                                    background: 'rgba(255,255,255,0.15)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/')}
                            startIcon={<ArrowBack />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                textTransform: 'none',
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                borderWidth: '2px',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.8)',
                                    background: 'rgba(255,255,255,0.15)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            Back to Tools
                        </Button>
                    </Box>
                </Fade>

                {/* Cover Letter Preview */}
                <Grow in timeout={1000}>
                    <Paper
                        elevation={6}
                        sx={{
                            overflow: 'hidden',
                            maxHeight: '800px',
                            overflowY: 'auto',
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                        }}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: coverLetterHtml }}
                            style={{
                                padding: '0',
                                backgroundColor: 'white',
                                minHeight: '100%',
                                margin: '0'
                            }}
                        />
                    </Paper>
                </Grow>

                {/* Success Message */}
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
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold',
                                color: 'white',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                                Cover Letter Generated Successfully!
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{
                            mb: 2,
                            color: 'rgba(255,255,255,0.9)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>
                            Your professional cover letter has been created. You can download it as HTML or print it directly.
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
        </Box>
    );
};

export default CoverLetterPreview;
