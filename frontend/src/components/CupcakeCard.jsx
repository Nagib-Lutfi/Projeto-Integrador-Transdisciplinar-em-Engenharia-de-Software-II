import React from 'react';
import { Link } from 'react-router-dom';

const CupcakeCard = ({ cupcake }) => {
  return (
    <div className="cupcake-card">
      <Link to={`/product/${cupcake.id}`}>
        <img src={cupcake.image} alt={cupcake.name} />
        <h3>{cupcake.name}</h3>
        <p>R$ {Number(cupcake.price).toFixed(2)}</p>
        <p>Estoque: {cupcake.stock}</p>
      </Link>
    </div>
  );
};

export default CupcakeCard;
