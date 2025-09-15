import React, { useEffect, useState } from 'react';
import './ImageSlider.css';

const slides = [
	'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1200&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
];

const ImageSlider = () => {
		const [idx, setIdx] = useState(0);
	const prev = () => setIdx((i) => (i === 0 ? slides.length - 1 : i - 1));
	const next = () => setIdx((i) => (i === slides.length - 1 ? 0 : i + 1));
		useEffect(() => {
			const timer = setInterval(next, 2000);
			return () => clearInterval(timer);
		}, []);
	return (
		<div className="slider">
			<button className="slider-btn left" aria-label="Previous" onClick={prev}>‹</button>
			<img src={slides[idx]} alt="Featured property" className="slider-img" />
			<button className="slider-btn right" aria-label="Next" onClick={next}>›</button>
		</div>
	);
};

export default ImageSlider;
