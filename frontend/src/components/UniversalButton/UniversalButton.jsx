import React from 'react';
import './UniversalButton.css';

const UniversalButton = ({ label, onClick, type = 'button' }) => {
	return (
		<button type={type} className="u-btn" onClick={onClick}>
			{label}
		</button>
	);
};

export default UniversalButton;
