import React, { useState, useEffect } from 'react';
import { API_URL } from '../services/api';

export default function Fruits({ token, cart, setCart }) {
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCart, setSavingCart] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/fruits`)
      .then(res => res.json())
      .then(data => {
        setFruits(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching fruits", err);
        setLoading(false);
      });
  }, []);

  const updateQuantity = (fruitId, delta) => {
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }
    setCart(prev => {
      const current = prev[fruitId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [fruitId]: next };
    });
  };

  const saveCartToBackend = async () => {
    if (!token) return;
    setSavingCart(true);
    const items = Object.entries(cart)
      .filter(([_, q]) => q > 0)
      .map(([fruit_id, quantity]) => ({ fruit_id, quantity }));

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });
      if (res.ok) {
        alert('Cart saved successfully!');
      } else {
        alert('Failed to save cart');
      }
    } catch (err) {
      console.error(err);
    }
    setSavingCart(false);
  };

  if (loading) return <div className="hero"><p>Loading fresh fruits...</p></div>;

  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">Nature's Candy, Delivered.</h1>
        <p className="hero-subtitle">Handpicked, organic, and locally sourced fruits brought directly to your table.</p>
      </div>
      
      <div className="fruits-grid">
        {fruits.map(fruit => (
          <div key={fruit.id} className="fruit-card">
            <img src={fruit.image_url} alt={fruit.name} className="fruit-img" />
            <div className="fruit-content">
              <div className="fruit-header">
                <h3 className="fruit-title">{fruit.name}</h3>
                <span className="fruit-price">${fruit.price.toFixed(2)}</span>
              </div>
              <div className="fruit-controls">
                <button className="quantity-btn" onClick={() => updateQuantity(fruit.id, -1)}>-</button>
                <span className="quantity-display">{cart[fruit.id] || 0}</span>
                <button className="quantity-btn" onClick={() => updateQuantity(fruit.id, 1)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {token && Object.values(cart).some(q => q > 0) && (
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button className="btn" onClick={saveCartToBackend} disabled={savingCart} style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
            {savingCart ? 'Saving...' : 'Save Cart'}
          </button>
        </div>
      )}
    </div>
  );
}
