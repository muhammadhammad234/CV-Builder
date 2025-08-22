import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Box,
    Fade,
    Slide,
    Zoom,
    Grow
} from '@mui/material';
import {
    Description,
    Business,
    Assessment,
    Star
} from '@mui/icons-material';

const tools = [
    {
        id: 'resume',
        name: 'Resume Builder',
        description: 'Create professional resumes with AI-powered content generation',
        features: [
            'Multiple professional templates',
            'AI-powered content enhancement',
            'Real-time preview',
            'Download as HTML'
        ],
        icon: Description,
        color: '#1976d2',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        route: '/template-selection',
        category: 'Document Creation'
    },
    {
        id: 'cover-letter',
        name: 'Cover Letter Builder',
        description: 'Generate personalized cover letters tailored to specific job descriptions',
        features: [
            'Job-specific customization',
            'Professional templates',
            'AI content generation',
            'Download and print ready'
        ],
        icon: Business,
        color: '#4caf50',
        gradient: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
        route: '/cover-letter-builder',
        category: 'Document Creation'
    },
    {
        id: 'ats-checker',
        name: 'ATS Score Checker',
        description: 'Analyze your resume against job descriptions for better ATS compatibility',
        features: [
            'PDF resume analysis',
            'Keyword matching',
            'Score breakdown',
            'Improvement suggestions'
        ],
        icon: Assessment,
        color: '#ff9800',
        gradient: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
        route: '/ats-checker',
        category: 'Analysis'
    }
];

const categories = [
    {
        name: 'Document Creation',
        description: 'Create professional documents for your job search',
        color: '#1976d2'
    },
    {
        name: 'Analysis',
        description: 'Analyze and improve your application materials',
        color: '#ff9800'
    }
];

const ToolSelection = () => {
    const navigate = useNavigate();

    const handleToolSelect = (tool) => {
        // Immediately navigate to the selected tool
        navigate(tool.route);
    };

    const getToolsByCategory = (categoryName) => {
        return tools.filter(tool => tool.category === categoryName);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Fade in timeout={1000}>
                <Box textAlign="center" mb={6}>
                    <Slide direction="down" in timeout={800}>
                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                mb: 2
                            }}
                        >
                            Professional Tools Suite
                        </Typography>
                    </Slide>
                    <Slide direction="up" in timeout={1000}>
                        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
                            Click on a tool to get started
                        </Typography>
                    </Slide>
                    <Zoom in timeout={1200}>
                        <Box sx={{
                            width: 60,
                            height: 4,
                            backgroundColor: 'white',
                            borderRadius: 2,
                            mx: 'auto',
                            opacity: 0.8
                        }} />
                    </Zoom>
                </Box>
            </Fade>

            {/* Tools by Category */}
            {categories.map((category, categoryIndex) => (
                <Fade in timeout={1200 + categoryIndex * 200} key={category.name}>
                    <Box mb={6}>
                        <Slide direction="left" in timeout={1000 + categoryIndex * 200}>
                            <Box textAlign="center" mb={4}>
                                <Typography variant="h4" component="h2" gutterBottom sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                    mb: 2
                                }}>
                                    {category.name}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'white', opacity: 0.8, mb: 3 }}>
                                    {category.description}
                                </Typography>
                            </Box>
                        </Slide>

                        <Grid container spacing={4} justifyContent="center">
                            {getToolsByCategory(category.name).map((tool, index) => (
                                <Grid item xs={12} md={6} lg={4} key={tool.id}>
                                    <Grow in timeout={800 + index * 200}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                background: 'rgba(255,255,255,0.1)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: `0 20px 40px rgba(0,0,0,0.3)`,
                                                    border: `2px solid ${tool.color}`,
                                                    background: `linear-gradient(135deg, ${tool.color}30 0%, ${tool.color}50 100%)`
                                                }
                                            }}
                                            onClick={() => handleToolSelect(tool)}
                                        >


                                            {/* Card Media with gradient background */}
                                            <CardMedia
                                                sx={{
                                                    height: 120,
                                                    background: tool.gradient,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative'
                                                }}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    color: 'white'
                                                }}>
                                                    <tool.icon sx={{ fontSize: 50, mb: 1, filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                                        {tool.name}
                                                    </Typography>
                                                </Box>
                                            </CardMedia>

                                            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body1" color="white" paragraph sx={{
                                                    mb: 3,
                                                    flex: 1,
                                                    opacity: 0.9,
                                                    lineHeight: 1.6
                                                }}>
                                                    {tool.description}
                                                </Typography>

                                                <Box>
                                                    {tool.features.map((feature, featureIndex) => (
                                                        <Typography
                                                            key={featureIndex}
                                                            variant="body2"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                mb: 1,
                                                                p: 0.5,
                                                                color: 'rgba(255,255,255,0.8)'
                                                            }}
                                                        >
                                                            <Star sx={{
                                                                fontSize: 14,
                                                                mr: 1.5,
                                                                color: tool.color
                                                            }} />
                                                            {feature}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grow>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Fade>
            ))}


        </Container>
    );
};

export default ToolSelection;
