import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Usuarios.css';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    }

    carregarUsuarios();
  }, []);

  return (
    <div className="usuarios-container">
      <h1>Usuários do Ponto</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Email</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.cargo}</td>
                <td>{usuario.email}</td>
                <td>{usuario.id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhum usuário encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        type="button"
        onClick={() => navigate('/home')}
        className="voltar-btn"
      >
        Voltar para Home
      </button>
    </div>
  );
}

export default Usuarios;
