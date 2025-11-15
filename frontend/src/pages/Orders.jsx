import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    API(`/api/orders/${userId}`)
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error fetching orders:', err));
  }, [navigate]);

  return (
    <div>
      <h1>Your Orders</h1>
      <div>
        {orders.map((order) => (
          <div key={order.id}>
            <p>Order ID: {order.id}</p>
            <p>Status: {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
