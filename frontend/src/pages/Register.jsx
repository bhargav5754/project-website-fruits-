import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';

export default function Register({ setToken, setUserFirstName, setIsAdmin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminField, setIsAdminField] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, is_admin: isAdminField })
      });
      
      const data = await res.json();
      if (res.ok) {
        setToken(data.access_token);
        setUserFirstName(data.first_name);
        setIsAdmin(data.is_admin);
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Account</h2>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input type="text" required className="form-input" value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input type="text" required className="form-input" value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" required className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" required className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="isAdmin" checked={isAdminField} onChange={e => setIsAdminField(e.target.checked)} />
          <label htmlFor="isAdmin" className="form-label" style={{ marginBottom: 0 }}>Register as Admin (For testing)</label>
        </div>
        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="form-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
