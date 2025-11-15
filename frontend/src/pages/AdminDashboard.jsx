import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [flavor, setFlavor] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [cupcakes, setCupcakes] = useState([]);
  const [updating, setUpdating] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchCupcakes = () => {
    API('/api/admin/cupcakes').then((data) => setCupcakes(data));
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== '1') {
      navigate('/');
      return;
    }
    fetchCupcakes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCupcake = {
      name,
      description,
      price,
      flavor,
      image,
      stock,
    };

    const response = await API(
      editingId ? `/api/admin/cupcakes/${editingId}` : '/api/admin/cupcakes',
      {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(newCupcake),
      }
    );

    if (response.id) {
      setName('');
      setDescription('');
      setPrice('');
      setFlavor('');
      setImage('');
      setStock('');
      setEditingId(null);
      fetchCupcakes();
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description);
    setPrice(String(c.price));
    setFlavor(c.flavor);
    setImage(c.image);
    setStock(String(c.stock));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!confirm('Tem certeza que deseja excluir este cupcake?')) return;
    API(`/api/admin/cupcakes/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res && res.error) {
          alert(res.error);
        }
        fetchCupcakes();
      });
  };

  return (
    <div>
      <h1>Painel de Administração</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Sabor"
          value={flavor}
          onChange={(e) => setFlavor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Imagem (URL)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const form = new FormData();
            form.append('image', file);
            const res = await API('/api/admin/upload', { method: 'POST', body: form });
            if (res && (res.absoluteUrl || res.url)) setImage(res.absoluteUrl || res.url);
          }}
        />
        <input
          type="number"
          placeholder="Estoque"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Salvar alterações' : 'Cadastrar Cupcake'}</button>
        {editingId && (
          <button
            type="button"
            className="danger"
            onClick={() => {
              setEditingId(null);
              setName('');
              setDescription('');
              setPrice('');
              setFlavor('');
              setImage('');
              setStock('');
            }}
            style={{ marginLeft: '10px' }}
          >
            Cancelar edição
          </button>
        )}
      </form>
      <h2>Inventário</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Sabor</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cupcakes.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>R$ {Number(c.price).toFixed(2)}</td>
              <td>{c.flavor}</td>
              <td>
                <input
                  type="number"
                  value={updating[c.id] ?? c.stock}
                  min="0"
                  onChange={(e) => setUpdating({ ...updating, [c.id]: Number(e.target.value) })}
                  style={{ width: '80px' }}
                />
              </td>
              <td>
                <button
                  onClick={() => {
                    const value = updating[c.id] ?? c.stock;
                    API(`/api/admin/stock/${c.id}`, {
                      method: 'POST',
                      body: JSON.stringify({ stock: Number(value) }),
                    }).then(() => fetchCupcakes());
                  }}
                >
                  Atualizar estoque
                </button>
                <button style={{ marginLeft: '8px' }} onClick={() => handleEdit(c)}>Editar</button>
                <button className="danger" style={{ marginLeft: '8px' }} onClick={() => handleDelete(c.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
