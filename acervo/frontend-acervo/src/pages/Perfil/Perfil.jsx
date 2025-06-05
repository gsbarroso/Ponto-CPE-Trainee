import { Link } from 'react-router-dom';
import './Perfil.css';

function Perfil() {
  // Simula dados do usuário logado
  const usuario = {
    nome: 'Gustavo Silvestre',
    email: 'gustavo@email.com',
    matricula: '2024019948',
    cargo: 'Trainee'
  };

  return (
    <div className="perfil-container">
      <h1>Meu Perfil</h1>
      <div className="perfil-card">
        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Matrícula:</strong> {usuario.matricula}</p>
        <p><strong>Cargo:</strong> {usuario.cargo}</p>
      </div>
      <Link to="/home">
        <button className="voltar-btn">Voltar para Home</button>
      </Link>
    </div>
  );
}

export default Perfil;
