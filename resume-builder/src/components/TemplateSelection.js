import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Grid,
    Box,
    Fade,
    Slide,
    Zoom,
    Grow
} from '@mui/material';
import { CheckCircle, Star, Palette, Business } from '@mui/icons-material';

const templates = [
    {
        id: 'cv_1',
        name: 'Professional Template',
        description: 'Clean and modern design perfect for corporate positions',
        preview: 'Professional layout with clear sections and elegant typography',
        features: ['Clean design', 'Professional look', 'Easy to read', 'Suitable for all industries'],
        icon: Business,
        color: '#1976d2',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 'cv_2',
        name: 'Creative Template',
        description: 'Modern and creative design for creative industries',
        preview: 'Creative layout with visual elements and modern styling',
        features: ['Creative design', 'Visual elements', 'Modern styling', 'Perfect for creative roles'],
        icon: Palette,
        color: '#e91e63',
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
    }
];

const TemplateSelection = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const navigate = useNavigate();

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template.id);
    };

    const handleContinue = () => {
        if (selectedTemplate) {
            navigate('/builder', { state: { selectedTemplate } });
        }
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
                            Choose Your Resume Template
                        </Typography>
                    </Slide>
                    <Slide direction="up" in timeout={1000}>
                        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
                            Select a template that best represents your professional style
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

            <Grid container spacing={4} justifyContent="center">
                {templates.map((template, index) => (
                    <Grid item xs={12} md={6} key={template.id}>
                        <Grow in timeout={800 + index * 200}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: selectedTemplate === template.id ? 'scale(1.05) translateY(-10px)' : 'scale(1)',
                                    border: selectedTemplate === template.id ? `3px solid ${template.color}` : '1px solid rgba(255,255,255,0.2)',
                                    background: selectedTemplate === template.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateY(-10px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                        background: 'rgba(255,255,255,0.98)'
                                    }
                                }}
                                onClick={() => handleTemplateSelect(template)}
                            >
                                <CardMedia
                                    component="div"
                                    sx={{
                                        height: 250,
                                        background: template.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(5px)'
                                        }}
                                    />
                                    <template.icon sx={{
                                        fontSize: 80,
                                        color: 'white',
                                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                                        zIndex: 1
                                    }} />
                                    {selectedTemplate === template.id && (
                                        <Zoom in timeout={300}>
                                            <CheckCircle
                                                sx={{
                                                    position: 'absolute',
                                                    top: 15,
                                                    right: 15,
                                                    fontSize: 35,
                                                    color: 'white',
                                                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                                                    zIndex: 2
                                                }}
                                            />
                                        </Zoom>
                                    )}
                                </CardMedia>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h4" component="h2" gutterBottom sx={{
                                        color: template.color,
                                        fontWeight: 'bold',
                                        mb: 2
                                    }}>
                                        {template.name}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 2 }}>
                                        {template.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        fontStyle: 'italic',
                                        mb: 3,
                                        p: 2,
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                        borderRadius: 1
                                    }}>
                                        {template.preview}
                                    </Typography>
                                    <Box>
                                        {template.features.map((feature, featureIndex) => (
                                            <Typography
                                                key={featureIndex}
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                    p: 0.5
                                                }}
                                            >
                                                <Star sx={{
                                                    fontSize: 16,
                                                    mr: 1.5,
                                                    color: template.color
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

            <Fade in timeout={1500}>
                <Box textAlign="center" mt={6}>
                    <Zoom in timeout={1600}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleContinue}
                            disabled={!selectedTemplate}
                            sx={{
                                px: 6,
                                py: 2,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                background: selectedTemplate ? 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)' : '#ccc',
                                boxShadow: selectedTemplate ? '0 8px 25px rgba(25, 118, 210, 0.3)' : 'none',
                                borderRadius: 3,
                                textTransform: 'none',
                                '&:hover': {
                                    background: selectedTemplate ? 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)' : '#ccc',
                                    transform: 'translateY(-2px)',
                                    boxShadow: selectedTemplate ? '0 12px 35px rgba(25, 118, 210, 0.4)' : 'none'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            Continue with Selected Template
                        </Button>
                    </Zoom>
                </Box>
            </Fade>

            {/* Back to Tools Button */}
            <Fade in timeout={1700}>
                <Box textAlign="center" mt={3}>
                    <Button
                        variant="outlined"
                        size="medium"
                        onClick={() => navigate('/')}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: 'rgba(255,255,255,0.6)',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        ← Back to Tools
                    </Button>
                </Box>
            </Fade>


        </Container>
    );
};

export default TemplateSelection;
