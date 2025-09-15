import React from 'react';
import './Header.css';
import PropertySearchBox from '../PropertySearchBox/PropertySearchBox';
import ImageSlider from '../ImageSlider/ImageSlider';
import UniversalButton from '../UniversalButton/UniversalButton';

const Header = () => {
	return (
			<header className="header">
				<div className="container">
					<div className="hero">
					<h1 className="hero-title">Find your next home with confidence</h1>
					<p className="hero-subtitle">Transparent listings, secure leases, and seamless payments</p>
					<div className="hero-center">
						<PropertySearchBox />
						<ImageSlider />
						<div className="cta-wrap">
							<UniversalButton label="List a Property" onClick={() => {}} />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;

