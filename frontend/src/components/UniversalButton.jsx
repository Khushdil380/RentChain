import React from 'react';
import '../styles/theme.css';

const UniversalButton = ({ children, ...props }) => (
  <button className="button" {...props}>
    {children}
  </button>
);

export default UniversalButton;
