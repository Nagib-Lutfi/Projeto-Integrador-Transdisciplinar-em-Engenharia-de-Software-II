import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const response = await API(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.id) {
      localStorage.setItem('userId', response.id);
      localStorage.setItem('isAdmin', response.isAdmin ? '1' : '0');
      navigate('/');
    } else {
      alert('Falha no login ou registro');
    }
  };

  return (
    <div>
      <h1>{isRegistering ? 'Registrar' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? 'Registrar' : 'Entrar'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Registrar'}
      </button>
    </div>
  );
};

export default Login;
