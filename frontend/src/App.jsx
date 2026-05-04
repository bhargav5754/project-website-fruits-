import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Fruits from './pages/Fruits';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userFirstName, setUserFirstName] = useState(localStorage.getItem('userFirstName'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [cart, setCart] = useState({});

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      if (userFirstName) localStorage.setItem('userFirstName', userFirstName);
      localStorage.setItem('isAdmin', isAdmin);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userFirstName');
      localStorage.removeItem('isAdmin');
      setCart({});
    }
  }, [token, userFirstName, isAdmin]);

  const logout = () => {
    setToken(null);
    setUserFirstName(null);
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="app-wrapper">
        <header className="navbar">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" className="logo">🍎 FreshOasis</Link>
            <div className="nav-links">
              {token ? (
                <>
                  {isAdmin && <Link to="/admin" className="nav-link" style={{ color: 'var(--primary)' }}>Admin Panel</Link>}
                  <span className="nav-link" style={{ cursor: 'default' }}>Welcome, {userFirstName}</span>
                  <Link to="/" className="nav-link">Shop</Link>
                  <Link to="/cart" className="nav-link">Cart</Link>
                  <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Login</Link>
                  <Link to="/register" className="btn" style={{ padding: '0.4rem 1rem' }}>Register</Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Fruits token={token} cart={cart} setCart={setCart} />} />
            <Route path="/login" element={!token ? <Login setToken={setToken} setUserFirstName={setUserFirstName} setIsAdmin={setIsAdmin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <Register setToken={setToken} setUserFirstName={setUserFirstName} setIsAdmin={setIsAdmin} /> : <Navigate to="/" />} />
            <Route path="/cart" element={token ? <Cart token={token} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={token && isAdmin ? <Admin token={token} /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
