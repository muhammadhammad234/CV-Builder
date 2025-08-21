import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TemplateSelection from './components/TemplateSelection';
import ResumeBuilder from './components/ResumeBuilder';
import ResumePreview from './components/ResumePreview';
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
            <Route path="/" element={<TemplateSelection />} />
            <Route path="/builder" element={<ResumeBuilder />} />
            <Route path="/preview" element={<ResumePreview />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
