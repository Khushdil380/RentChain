import React from 'react';
import './HeaderTab.css';
import Logo from '../Logo/Logo';
import NavBar from '../NavBar/NavBar';

const HeaderTab = () => {
	return (
		<div className="header-tab">
			<Logo />
			<NavBar />
		</div>
	);
};

export default HeaderTab;
