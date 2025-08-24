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
import { Download, Print, ArrowBack, Fullscreen, FullscreenExit, CheckCircle, Star, Description } from '@mui/icons-material';

// Add CSS for proper bullet point styling
const previewStyles = `
    <style>
        /* Global reset for the preview content */
        .resume-preview-content * {
            box-sizing: border-box !important;
        }
        
        .resume-preview-content {
            font-family: Arial, sans-serif !important;
            line-height: 1.6 !important;
            color: #333 !important;
            text-align: left !important;
        }
        
        /* Global text alignment override */
        .resume-preview-content,
        .resume-preview-content * {
            text-align: left !important;
        }
        
        /* Force proper list styling */
        .resume-preview-content ul,
        .resume-preview-content ol {
            margin: 0 !important;
            padding-left: 20px !important;
            text-align: left !important;
            list-style-position: outside !important;
        }
        
        .resume-preview-content li {
            text-align: left !important;
            margin-bottom: 5px !important;
            list-style-position: outside !important;
            display: list-item !important;
        }
        
        /* Override any inline styles that might cause center alignment */
        .resume-preview-content [style*="text-align: center"] {
            text-align: left !important;
        }
        
        .resume-preview-content li[style*="text-align: center"] {
            text-align: left !important;
        }
        
        .resume-preview-content ul[style*="text-align: center"],
        .resume-preview-content ol[style*="text-align: center"] {
            text-align: left !important;
        }
        
        /* Additional specificity for stubborn elements */
        .resume-preview-content div[style*="text-align: center"],
        .resume-preview-content p[style*="text-align: center"],
        .resume-preview-content span[style*="text-align: center"] {
            text-align: left !important;
        }
        
        /* Force text alignment within list items */
        .resume-preview-content li * {
            text-align: left !important;
        }
        
        .resume-preview-content li div,
        .resume-preview-content li p,
        .resume-preview-content li span {
            text-align: left !important;
        }
        
        /* Override any inherited center alignment */
        .resume-preview-content li,
        .resume-preview-content li *,
        .resume-preview-content ul *,
        .resume-preview-content ol * {
            text-align: left !important;
        }
        
        /* Force all headings to be left aligned */
        .resume-preview-content h1,
        .resume-preview-content h2,
        .resume-preview-content h3,
        .resume-preview-content h4,
        .resume-preview-content h5,
        .resume-preview-content h6 {
            text-align: left !important;
        }
        
        /* Force all section titles and labels to be left aligned */
        .resume-preview-content .section-title,
        .resume-preview-content .section-header,
        .resume-preview-content .title,
        .resume-preview-content .label {
            text-align: left !important;
        }
        
        /* Override any CSS classes that might cause center alignment */
        .resume-preview-content [class*="center"],
        .resume-preview-content [class*="Center"] {
            text-align: left !important;
        }
        
        /* Force all text content to be left aligned */
        .resume-preview-content * {
            text-align: left !important;
        }
        
        /* Ensure bullets are visible and properly positioned */
        .resume-preview-content ul li::before {
            content: "• " !important;
            margin-right: 5px !important;
        }
        
        .resume-preview-content ol li {
            counter-increment: list-counter !important;
        }
        
        .resume-preview-content ol li::before {
            content: counter(list-counter) ". " !important;
            margin-right: 5px !important;
        }
    </style>
`;

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

            // Ensure proper HTML structure
            if (!cleanedHtml.startsWith('<')) {
                console.warn('HTML content doesn\'t start with <, attempting to fix...');
                // Try to find the first HTML tag
                const htmlMatch = cleanedHtml.match(/<[^>]+>/);
                if (htmlMatch) {
                    const startIndex = cleanedHtml.indexOf(htmlMatch[0]);
                    cleanedHtml = cleanedHtml.substring(startIndex);
                }
            }

            // Fix bullet point alignment issues
            cleanedHtml = cleanedHtml.replace(
                /<li[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>/gi,
                '<li style="text-align: left;">'
            );

            // Ensure proper list styling
            cleanedHtml = cleanedHtml.replace(
                /<ul[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>/gi,
                '<ul style="text-align: left; padding-left: 20px;">'
            );

            // Fix any heading elements (h1, h2, h3, h4, h5, h6) with center alignment
            cleanedHtml = cleanedHtml.replace(
                /<(h[1-6])[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>/gi,
                '<$1 style="text-align: left;">'
            );

            // Fix any div elements with center alignment (for sections like Summary)
            cleanedHtml = cleanedHtml.replace(
                /<div[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>/gi,
                '<div style="text-align: left;">'
            );

            // Fix any p elements with center alignment
            cleanedHtml = cleanedHtml.replace(
                /<p[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>/gi,
                '<p style="text-align: left;">'
            );

            // Fix any span elements with center alignment
            cleanedHtml = cleanedHtml.replace(
                /<span[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>/gi,
                '<span style="text-align: left;">'
            );

            // More comprehensive fix for any element with center alignment
            cleanedHtml = cleanedHtml.replace(
                /<([^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*)>/gi,
                function (match, content) {
                    // Replace the style attribute to remove center alignment
                    const fixedContent = content.replace(
                        /style="([^"]*text-align:\s*center[^"]*)"/gi,
                        'style="$1; text-align: left !important;"'
                    );
                    return '<' + fixedContent + '>';
                }
            );

            // Add the preview styles to the HTML
            cleanedHtml = previewStyles + cleanedHtml;

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
            <Container maxWidth={fullscreen ? false : 'lg'} sx={{
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
                                    mb: 2,
                                    textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }
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
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        color: 'rgba(255,255,255,0.9)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.8)',
                                            background: 'rgba(255,255,255,0.15)'
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
                                        background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                                        backdropFilter: 'blur(10px)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        borderRadius: 4,
                                        textTransform: 'none',
                                        boxShadow: '0 8px 32px rgba(255, 152, 0, 0.4)',
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
                                            background: 'linear-gradient(135deg, #ff5722 0%, #ff9800 100%)',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 12px 40px rgba(255, 152, 0, 0.6)',
                                            '&:before': {
                                                left: '100%'
                                            }
                                        },
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    Print Resume
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<Description />}
                                    onClick={() => navigate('/cover-letter-builder')}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        color: 'rgba(255,255,255,0.9)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.8)',
                                            background: 'rgba(255,255,255,0.15)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Generate Cover Letter
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBack />}
                                    onClick={() => navigate('/')}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        color: 'rgba(255,255,255,0.9)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.8)',
                                            background: 'rgba(255,255,255,0.15)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Back to Tools
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
                            border: '1px solid rgba(0,0,0,0.05)',
                            backgroundColor: 'white'
                        }}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: resumeHtml }}
                            style={{
                                padding: '30px',
                                backgroundColor: 'white',
                                minHeight: '100%'
                            }}
                            className="resume-preview-content"
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
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                Resume Generated Successfully!
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
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
        </Box>
    );
};

export default ResumePreview;
