import React from 'react';
import './UserLinks.css';

const Group = ({ title, items }) => (
  <div>
    <h5 className="section-title" style={{ marginBottom: 6 }}>{title}</h5>
    <ul className="link-list">
      {items.map((i) => <li key={i}><a href="#">{i}</a></li>)}
    </ul>
  </div>
);

const UserLinks = () => {
  return (
    <div className="f-user">
      <h4 className="section-title">For Users</h4>
      <div className="f-user-grid">
        <Group title="Tenant" items={[ 'Search Rentals', 'Pay Rent', 'My Leases' ]} />
        <Group title="Landlord" items={[ 'Add Property', 'Manage Listings', 'Payments' ]} />
        <Group title="Admin" items={[ 'Dashboard', 'Approvals', 'Disputes' ]} />
      </div>
    </div>
  );
};

export default UserLinks;