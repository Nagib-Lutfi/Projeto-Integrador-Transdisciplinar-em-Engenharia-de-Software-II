import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    API(`/api/cart/${userId}`)
      .then((data) => setCartItems(data))
      .catch((err) => console.error('Error fetching cart:', err));
  }, [navigate]);

  const handleRemoveItem = (id) => {
    const userId = localStorage.getItem('userId');
    API(`/api/cart/${userId}/remove`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    }).then(() => {
      setCartItems(cartItems.filter((item) => item.id !== id));
    });
  };

  return (
    <div>
      <h1>Seu Carrinho</h1>
      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <p>{item.name}</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => handleRemoveItem(item.id)}>Remover</button>
          </div>
        ))}
      </div>
      <button onClick={() => (window.location.href = '/checkout')}>Checkout</button>
    </div>
  );
};

export default Cart;
