import { Link } from 'react-router-dom';
import './Usuarios.css';

function Usuarios() {
  // Simula lista de usuários
  const usuarios = [
    { nome: 'Gustavo Silvestre', email: 'gustavo@email.com', matricula: '2024019948', cargo: 'Trainee' },
    { nome: 'Maria Rita', email: 'maria@email.com', matricula: '20231235', cargo: 'Analista' },
    { nome: 'Carlos Souza', email: 'carlos@email.com', matricula: '20231236', cargo: 'Coordenador' },
    { nome: 'Ana Lima', email: 'ana@email.com', matricula: '20231237', cargo: 'Gerente' }
  ];

  return (
    <div className="usuarios-container">
      <h1>Usuários do Ponto</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Matrícula</th>
            <th>Cargo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user, index) => (
            <tr key={index}>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.matricula}</td>
              <td>{user.cargo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/home">
        <button className="voltar-btn">Voltar para Home</button>
      </Link>
    </div>
  );
}

export default Usuarios;
