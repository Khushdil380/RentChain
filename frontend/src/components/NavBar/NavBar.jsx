import React from 'react';
import './NavBar.css';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../../routes';

const NavBar = () => {
  const { pathname } = useLocation();
  return (
		<nav className="nav">
			<ul className="nav-list">
					{navLinks.map((l) => (
						<li key={l.path}><Link to={l.path} className={`nav-link ${pathname === l.path ? 'active' : ''}`}>{l.label}</Link></li>
				))}
			</ul>
				<Link to="/join" className="nav-cta">Join Now</Link>
		</nav>
	);
};

export default NavBar;
