// components/FooterNav.js
import React from 'react';
import { FaCommentDots, FaRegCircle, FaCog } from 'react-icons/fa';
import './FooterNav.css';

const FooterNav = ({ setActivePage, activePage }) => {
  return (
    <div className="footer-nav">
      <button onClick={() => setActivePage('chat')}>
        <FaCommentDots size={22} color={activePage === 'chat' ? '#25D366' : '#555'} />
      </button>
      <button onClick={() => setActivePage('status')}>
        <FaRegCircle size={22} color={activePage === 'status' ? '#25D366' : '#555'} />
      </button>
      <button onClick={() => setActivePage('settings')}>
        <FaCog size={22} color={activePage === 'settings' ? '#25D366' : '#555'} />
      </button>
    </div>
  );
};

export default FooterNav;
