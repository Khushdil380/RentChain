export const routes = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/contact', label: 'Contact' },
  { path: '/join', label: 'Join' },
];

export const navLinks = routes.filter(r => r.label && r.path !== '/join');