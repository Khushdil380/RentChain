import React from 'react';
import './Logo.css';

const Logo = () => {
	return (
		<div className="logo">
			<div className="logo-icon" aria-hidden="true" />
			<div className="logo-texts">
				<div className="logo-title">RentChain</div>
				<div className="logo-slogan">Where Rent Meets Transparency</div>
			</div>
		</div>
	);
};

export default Logo;
