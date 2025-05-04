import React, { useState, useEffect } from 'react';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ChatWindow from './components/ChatWindow';
import FooterNav from './components/FooterNav';
import StatusPage from './components/StatusPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';

import { db } from './firebase';
import { ref, set, onValue } from 'firebase/database';

import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [authPage, setAuthPage] = useState('login');
  const [userData, setUserData] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  // Firebase demo
  useEffect(() => {
    const demoRef = ref(db, 'demo/visitCount');
    set(demoRef, { count: 1 });

    onValue(demoRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Visit count:', data);
    });
  }, []);

  // Authentication pages
  if (!isLoggedIn) {
    return authPage === 'login' ? (
      <LoginPage
        onLogin={(user) => {
          setUserData(user);
          setIsLoggedIn(true);
        }}
        goToRegister={() => setAuthPage('register')}
      />
    ) : (
      <RegisterPage
        onRegister={(user) => {
          setUserData(user);
          setIsLoggedIn(true);
        }}
        goToLogin={() => setAuthPage('login')}
      />
    );
  }

  // Main content
  return (
    <div className="app">
      <header className="header">
        <div className="logo">NetChat</div>
        <div className="menu">
          <select onChange={(e) => setActivePage(e.target.value)} value={activePage}>
            <option value="home">Home</option>
            <option value="chat">Chat</option>
            <option value="status">Status</option>
            <option value="settings">Settings</option>
          </select>
        </div>
      </header>

      <main className="main-content">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            setTargetUser={setTargetUser}
          />
        )}
        {activePage === 'chat' && targetUser && (
          <ChatWindow targetUser={targetUser} currentUser={userData} />
        )}
        {activePage === 'status' && (
          <StatusPage currentUser={userData} />
        )}
        {activePage === 'settings' && (
          <ProfilePage user={userData} setUserData={setUserData} />
        )}
        {activePage &&
          !['home', 'chat', 'status', 'settings'].includes(activePage) && (
            <div className="placeholder-page">
              <h2>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h2>
              <p>This is the {activePage} page.</p>
            </div>
        )}
      </main>

      <FooterNav setActivePage={setActivePage} activePage={activePage} />
    </div>
  );
};

export default App;
