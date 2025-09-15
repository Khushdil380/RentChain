import React from 'react';
import './PropertySearchBox.css';

const PropertySearchBox = () => {
	return (
		<div className="search">
			<span className="search-icon" aria-hidden="true">🔍</span>
			<input
				type="text"
				placeholder="Search properties by city or rent range"
				className="search-input"
			/>
		</div>
	);
};

export default PropertySearchBox;
