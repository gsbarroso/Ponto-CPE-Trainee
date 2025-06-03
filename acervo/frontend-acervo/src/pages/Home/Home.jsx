import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
        </div>
        <nav className="menu">
          <a href="#">Home</a>
          <a href="#">Perfil</a>
          <a href="#">Usuários</a>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </nav>
      </header>

      {/* Espaço reservado para imagem */}
      <div className="image-placeholder">
        <p>Espaço reservado para imagem</p>
      </div>

      {/* Tabela */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Membro</th>
              <th>Chegada</th>
              <th>Tempo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>
                  <strong>Mariana Ribeiro</strong>
                  <div className="subtext">Gerente de Recrutamento</div>
                </div>
              </td>
              <td>22:34</td>
              <td>01:34</td>
              <td>
                <button className="delete-btn">Excluir</button>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <strong>Oswaldo Neto</strong>
                  <div className="subtext">Dev Líder</div>
                </div>
              </td>
              <td>22:34</td>
              <td>01:34</td>
              <td>
                <button className="delete-btn">Excluir</button>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  <strong>João Prajá</strong>
                  <div className="subtext">Dev Líder</div>
                </div>
              </td>
              <td>22:34</td>
              <td>01:34</td>
              <td>
                <button className="delete-btn">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
