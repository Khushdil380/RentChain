import React, { useState } from 'react';
import './FAQ.css';

const FAQItem = ({ question, answer, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>      
      <button
        type="button"
        className="faq-trigger"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className="faq-q-text">{question}</span>
        <span className="faq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <div className="faq-panel" role="region" aria-hidden={!open}>
        <div className="faq-answer" dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  );
};

export default FAQItem;
