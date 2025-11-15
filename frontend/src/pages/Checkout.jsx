import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('normal');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    API(`/api/cart/${userId}`).then((items) => {
      const t = items.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0);
      setTotal(Number(t.toFixed(2)));
    });
  }, [navigate]);

  const handleCheckout = () => {
    const order = {
      total,
      shipping_address: address,
      shipping_method: shippingMethod,
    };
    const userId = localStorage.getItem('userId');
    API(`/api/orders/${userId}/checkout`, {
      method: 'POST',
      body: JSON.stringify(order),
    }).then(() => alert('Order placed!'));
  };

  return (
    <div>
      <h1>Checkout</h1>
      <div>
        <label>Endereço:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tipo de Entrega:</label>
        <select
          value={shippingMethod}
          onChange={(e) => setShippingMethod(e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="express">Expressa</option>
        </select>
      </div>
      <div>
        <label>Método de Pagamento:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="credit_card">Cartão de Crédito</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>
      <button onClick={handleCheckout}>Colocar Pedido</button>
    </div>
  );
};

export default Checkout;
