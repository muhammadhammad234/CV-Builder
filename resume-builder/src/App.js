import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ToolSelection from './components/ToolSelection';
import TemplateSelection from './components/TemplateSelection';
import ResumeBuilder from './components/ResumeBuilder';
import ResumePreview from './components/ResumePreview';
import CoverLetterBuilder from './components/CoverLetterBuilder';
import CoverLetterPreview from './components/CoverLetterPreview';
import ATSChecker from './components/ATSChecker';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<ToolSelection />} />
            <Route path="/template-selection" element={<TemplateSelection />} />
            <Route path="/builder" element={<ResumeBuilder />} />
            <Route path="/preview" element={<ResumePreview />} />
            <Route path="/cover-letter-builder" element={<CoverLetterBuilder />} />
            <Route path="/cover-letter-preview" element={<CoverLetterPreview />} />
            <Route path="/ats-checker" element={<ATSChecker />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
