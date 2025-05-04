import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebase';
import { FiSearch, FiMessageSquare } from 'react-icons/fi';
import './HomePage.css';

const HomePage = ({ setActivePage, setTargetUser }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [messageCount, setMessageCount] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse currentUser:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList = [];

      for (let id in data) {
        if (id !== currentUser.id) {
          usersList.push({ id, ...data[id] });
        }
      }

      setUsers(usersList);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const unreadRef = ref(db, `messages/${currentUser.phone}`);
    onValue(unreadRef, (snapshot) => {
      const data = snapshot.val();
      const unreadCounts = {};
      const messageTotals = {};

      for (let chatId in data) {
        const messages = data[chatId];
        let unread = 0;
        let total = 0;

        Object.values(messages).forEach((msg) => {
          total++;
          if (!msg.read && msg.receiver === currentUser.phone) {
            unread++;
          }
        });

        if (unread > 0) unreadCounts[chatId] = unread;
        if (total > 0) messageTotals[chatId] = total;
      }

      setUnreadMessages(unreadCounts);
      setMessageCount(messageTotals);
    });
  }, [currentUser]);

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (user) => {
    // Set target user for chat
    if (setTargetUser && typeof setTargetUser === 'function') {
      setTargetUser(user); // Set selected user
      setActivePage('chat'); // Change page to chat

      // Mark messages as read when user clicks on chat
      const chatId = getChatId(currentUser.phone, user.phone);
      const messagesRef = ref(db, `messages/${chatId}`);
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          Object.values(data).forEach((msg) => {
            if (msg.receiver === currentUser.phone && !msg.read) {
              const messageKey = msg.timestamp; // Unique key for each message
              update(ref(db, `messages/${chatId}/${messageKey}`), {
                read: true,
              });
            }
          });
        }
      });
    } else {
      console.warn('setTargetUser is not a function');
    }
  };

  const getChatId = (phone1, phone2) => {
    return [phone1, phone2].sort().join('_');
  };

  return (
    <div className="home-container">
      {/* Search Bar */}
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

      {/* User List */}
      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const chatId = getChatId(currentUser.phone, user.phone);
            return (
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
                    <h4>{user.username}</h4>
                    <p className="bio">{user.bio || 'Nta bio.'}</p>
                  </div>
                </div>
                <button className="chat-btn" onClick={() => handleChatClick(user)}>
                  <FiMessageSquare size={18} /> Chat
                  {messageCount[chatId] && (
                    <span className="message-count">
                      {messageCount[chatId]}
                    </span>
                  )}
                  {unreadMessages[chatId] && (
                    <span className="unread-badge">
                      {unreadMessages[chatId]}
                    </span>
                  )}
                </button>
              </div>
            );
          })
        ) : (
          <p className="no-users">Nta mukoresha wabonetse.</p>
        )}
      </div>

      {/* Floating Modal */}
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
