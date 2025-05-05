import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { FiSearch, FiMessageSquare } from 'react-icons/fi';
import './HomePage.css';

const HomePage = ({ setActivePage, setTargetUser }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList = [];

      if (data) {
        for (let phone in data) {
          usersList.push({ id: phone, phone, ...data[phone] });
        }
      }

      setUsers(usersList);
    });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (user) => {
    setTargetUser(user);
    setActivePage('chat');
  };

  return (
    <div className="home-container">
      <div className="search-bar-container">
        <div className="search-bar">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Shaka ukoresha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <img
                  src={user.profilePic || 'https://via.placeholder.com/50'}
                  alt="avatar"
                  className="avatar"
                  onClick={() => setSelectedUser(user)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="user-text">
                  <h4>{user.username || 'Izina ritabashije kuboneka'}</h4>
                  <p className="bio">{user.bio || 'Nta bio.'}</p>
                </div>
              </div>
              <button className="chat-btn" onClick={() => handleChatClick(user)}>
                <FiMessageSquare size={18} /> Chat
              </button>
            </div>
          ))
        ) : (
          <p className="no-users">Nta mukoresha wabonetse.</p>
        )}
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-card">
            <img
              src={selectedUser.profilePic || 'https://via.placeholder.com/150'}
              alt="avatar"
              className="modal-avatar"
            />
            <h2>{selectedUser.username}</h2>
            <p>{selectedUser.bio || 'Nta bio ihari.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
