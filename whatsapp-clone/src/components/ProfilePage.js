import React, { useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();

  // Redirect niba user atabaho
  useEffect(() => {
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Tegereza gato...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>Umwirondoro</h2>

      <div className="profile-section">
        <img
          src={user.profilePic || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="profile-pic"
        />
      </div>

      <div className="profile-field">
        <strong>Full Name:</strong> {user.fullName || 'Nta mazina yuzuye'}
      </div>

      <div className="profile-field">
        <strong>Username:</strong> {user.username || 'Nta username'}
      </div>

      <div className="profile-field">
        <strong>Phone:</strong> {user.phone || 'Nta telephone'}
      </div>

      <div className="profile-field">
        <strong>Account Type:</strong> {user.accountType || 'Nta bwoko bwa konti'}
      </div>

      <div className="profile-field">
        <strong>Bio:</strong> {user.bio || 'Nta bisobanuro'}
      </div>
    </div>
  );
};

export default ProfilePage;
