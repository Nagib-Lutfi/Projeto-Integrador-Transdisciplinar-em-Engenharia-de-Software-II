import React, { useState, useEffect } from 'react';
import API from '../api';
import CupcakeCard from '../components/CupcakeCard';

const Home = () => {
  const [cupcakes, setCupcakes] = useState([]);

  useEffect(() => {
    API('/api/cupcakes')
      .then((data) => setCupcakes(data))
      .catch((err) => console.error('Error fetching cupcakes:', err));
  }, []);

  return (
    <div>
      <h1>Vitrine de Cupcakes</h1>
      <div className="cupcake-list">
        {cupcakes.map((cupcake) => (
          <CupcakeCard key={cupcake.id} cupcake={cupcake} />
        ))}
      </div>
    </div>
  );
};

export default Home;
