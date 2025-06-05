import React, { useState } from 'react';
import { useUsers, useCreateUser } from '../hooks/useUsers';

const UsersPage = () => {
  const { users, loading, fetchUsers } = useUsers();
  const { handleCreateUser } = useCreateUser();

  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateUser({ name });
    setName('');
    fetchUsers(); // Atualiza a lista após cadastrar
  };

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      <h2>Adicionar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do usuário"
        />
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
};

export default UsersPage;
