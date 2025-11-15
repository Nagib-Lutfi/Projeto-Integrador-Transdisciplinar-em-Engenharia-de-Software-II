import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const userId = localStorage.getItem('userId');
  const isAdmin = localStorage.getItem('isAdmin') === '1';
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    window.location.reload();
  };

  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        {userId ? (
          <>
            <Link to="/cart">Carrinho</Link>
            <Link to="/orders">Meus Pedidos</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
