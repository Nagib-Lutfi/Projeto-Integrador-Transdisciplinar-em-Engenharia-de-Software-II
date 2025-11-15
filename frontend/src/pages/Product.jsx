import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    API(`/api/cupcakes/${id}`)
      .then((data) => setProduct(data))
      .catch((err) => console.error('Error fetching product:', err));
  }, [id]);

  const handleAddToCart = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    const cartItem = { cupcakeId: product.id, quantity };
    API(`/api/cart/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify(cartItem),
    }).then(() => alert('Cupcake added to cart!'));
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>Preço: R$ {Number(product.price).toFixed(2)}</p>
      <p>Estoque: {product.stock}</p>
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(Number(product.stock || 1), Number(e.target.value))))}
          min="1"
          max={product.stock || 1}
        />
      </div>
      <button onClick={handleAddToCart} disabled={!product.stock || product.stock <= 0}>Adicionar ao carrinho</button>
    </div>
  );
};

export default Product;
