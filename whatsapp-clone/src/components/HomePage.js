import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebase';
import { FiSearch, FiMessageSquare } from 'react-icons/fi';
import './HomePage.css';

const HomePage = ({ setActivePage, setTargetUser, currentUserPhone }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [messageCount, setMessageCount] = useState({});

  // Get currentUser from Firebase using phone number
  useEffect(() => {
    if (!currentUserPhone) return;

    const userRef = ref(db, `users/${currentUserPhone}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentUser({ id: currentUserPhone, ...data });
      }
    });
  }, [currentUserPhone]);

  // Fetch all users except current user
  useEffect(() => {
    if (!currentUser) return;

    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList = [];

      if (data) {
        for (let phone in data) {
          if (phone !== currentUser.id) {
            usersList.push({ id: phone, phone, ...data[phone] });
          }
        }
      }

      setUsers(usersList);
    });
  }, [currentUser]);

  // Fetch unread messages and message counts
  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = ref(db, `messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const unreadCounts = {};
      const messageTotals = {};

      if (data) {
        for (let chatId in data) {
          const messages = data[chatId];
          let unread = 0;
          let total = 0;

          Object.values(messages).forEach((msg) => {
            total++;
            if (!msg.read && msg.receiver === currentUser.id) {
              unread++;
            }
          });

          if (unread > 0) unreadCounts[chatId] = unread;
          if (total > 0) messageTotals[chatId] = total;
        }
      }

      setUnreadMessages(unreadCounts);
      setMessageCount(messageTotals);
    });
  }, [currentUser]);

  // Generate chat ID
  const getChatId = (phone1, phone2) => {
    return [phone1, phone2].sort().join('_');
  };

  const handleChatClick = (user) => {
    if (setTargetUser && typeof setTargetUser === 'function') {
      setTargetUser(user);
      setActivePage('chat');

      const chatId = getChatId(currentUser.id, user.id);
      const chatRef = ref(db, `messages/${chatId}`);

      onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          Object.entries(data).forEach(([key, msg]) => {
            if (!msg.read && msg.receiver === currentUser.id) {
              update(ref(db, `messages/${chatId}/${key}`), { read: true });
            }
          });
        }
      });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          filteredUsers.map((user) => {
            const chatId = getChatId(currentUser.id, user.id);
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
                    <span className="message-count">{messageCount[chatId]}</span>
                  )}
                  {unreadMessages[chatId] && (
                    <span className="unread-badge">{unreadMessages[chatId]}</span>
                  )}
                </button>
              </div>
            );
          })
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
