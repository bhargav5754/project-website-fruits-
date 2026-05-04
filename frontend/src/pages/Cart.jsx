import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';

export default function Cart({ token }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setCartItems(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching cart", err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div className="hero"><p>Loading your cart...</p></div>;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>Looks like you haven't added any fresh fruits yet.</p>
        <Link to="/" className="btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="form-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Your Cart</h2>
      {cartItems.map((item, idx) => (
        <div key={idx} className="cart-item">
          <div className="cart-item-info">
            <img src={item.image_url} alt={item.name} className="cart-item-img" />
            <div>
              <h3 className="cart-item-title">{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)} x {item.quantity}</p>
            </div>
          </div>
          <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <span>Total</span>
        <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
