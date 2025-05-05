import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';

function RegisterPage({ onRegister, goToLogin }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [preview, setPreview] = useState(null);
  const [bio, setBio] = useState('');
  const [accountType, setAccountType] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('Ifoto irengeje 5MB. Hitamo ifoto nto.');
        setPreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;

        // Tugenekere ubunini bwa base64
        const estimatedBase64Size = Math.ceil(file.size * 1.37);
        if (estimatedBase64Size > maxSize) {
          setError('Base64 y’iyo foto irengeje 5MB. Hitamo indi.');
          setPreview(null);
          return;
        }

        setPreview(base64String);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!phone || !password || !fullName || !username || !bio || !accountType) {
      alert('Uzuza byose mbere yo kwiyandikisha.');
      return;
    }
    if (!preview) {
      alert('Shyiramo ifoto mbere yo kwiyandikisha.');
      return;
    }

    const userRef = ref(db, 'users/' + phone);
    const userData = {
      phone,
      password,
      fullName,
      username,
      profilePic: preview, // base64 string
      bio,
      accountType,
      createdAt: new Date().toISOString(),
    };

    try {
      await set(userRef, userData);
      alert('Wiyandikishije neza! Injira ukoresheje nimero na password.');
      goToLogin();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Habaye ikibazo. Gerageza nanone.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Kwiyandikisha</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Amazina yawe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="tel"
          placeholder="Nimero ya telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Ijambobanga"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Andika Bio yawe"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
          style={styles.textarea}
        />
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Hitamo account type</option>
          <option value="author">Author</option>
          <option value="writer">Writer</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            style={styles.imagePreview}
          />
        )}

        <button type="submit" style={styles.button}>
          Iyandikishe
        </button>
      </form>

      <p style={styles.loginText}>
        Ufite konti?{' '}
        <button onClick={goToLogin} style={styles.loginButton}>
          Injira
        </button>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: '320px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '12px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #aaa',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #aaa',
    minHeight: '60px',
  },
  fileInput: {
    marginTop: '10px',
  },
  imagePreview: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '50%',
    margin: '10px auto',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  loginText: {
    marginTop: '15px',
  },
  loginButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default RegisterPage;
