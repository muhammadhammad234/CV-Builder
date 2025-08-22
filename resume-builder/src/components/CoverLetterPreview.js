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
        navigate('/cover-letter-builder');
    };

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Fade in timeout={300}>
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                </Fade>
                <Button
                    variant="contained"
                    onClick={() => navigate('/cover-letter-builder')}
                    startIcon={<ArrowBack />}
                    sx={{ borderRadius: 2 }}
                >
                    Back to Cover Letter Builder
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Fade in timeout={800}>
                <Box mb={4}>
                    <Slide direction="down" in timeout={600}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h3" component="h1" sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                📄 Cover Letter Preview
                            </Typography>
                        </Box>
                    </Slide>
                    <Slide direction="up" in timeout={800}>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
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
                            borderRadius: 2,
                            textTransform: 'none',
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
                            borderRadius: 2,
                            textTransform: 'none',
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
                            borderRadius: 2,
                            textTransform: 'none',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                                borderColor: '#1565c0',
                                background: 'rgba(25, 118, 210, 0.04)',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
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
                            borderRadius: 2,
                            textTransform: 'none',
                            borderColor: '#757575',
                            color: '#757575',
                            '&:hover': {
                                borderColor: '#424242',
                                background: 'rgba(117, 117, 117, 0.04)',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Back to Templates
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
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <div
                        dangerouslySetInnerHTML={{ __html: coverLetterHtml }}
                        style={{
                            padding: '30px',
                            backgroundColor: 'white',
                            minHeight: '100%'
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
                        <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                            Cover Letter Generated Successfully!
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
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
    );
};

export default CoverLetterPreview;
