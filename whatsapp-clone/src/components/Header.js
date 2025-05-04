import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="app-header">
      <div className="logo">NetChat</div>
      <input
        type="text"
        className="search-input"
        placeholder="Search chats or contacts"
      />
      <div className="menu-icon" onClick={toggleMenu}>☰</div>

      {menuOpen && (
        <div className="dropdown-menu">
          <div className="menu-item">👤 Profile</div>
          <div className="menu-item">💬 Chat</div>
          <div className="menu-item">📷 Status</div>
          <div className="menu-item">👥 Group</div>
          <div className="menu-item">⚙️ Settings</div>
        </div>
      )}
    </header>
  );
};

export default Header;
