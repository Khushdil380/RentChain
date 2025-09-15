import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/colors.css';
import './styles/theme.css';
import './index.css';
import './styles/main.css';

import Home from './pages/Home';
import Properties from './pages/Properties';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Join from './pages/Join';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
  <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
