import React, { useState, useEffect } from 'react';
import { API_URL } from '../services/api';

export default function Admin({ token }) {
  const [adminCarts, setAdminCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/admin/carts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setAdminCarts(data.admin_carts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching admin carts", err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div className="hero"><p>Loading admin panel...</p></div>;

  return (
    <div className="cart-container" style={{ maxWidth: '1000px' }}>
      <h2 className="form-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>User Carts Monitoring</h2>
      {adminCarts.length === 0 ? (
        <p>No user carts found.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Selected Fruits</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {adminCarts.map((userCart, idx) => {
                const total = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return (
                  <tr key={idx}>
                    <td>{userCart.user_name}</td>
                    <td>{userCart.email}</td>
                    <td>
                      <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {userCart.items.map((item, i) => (
                          <li key={i}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)}</li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>${total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
