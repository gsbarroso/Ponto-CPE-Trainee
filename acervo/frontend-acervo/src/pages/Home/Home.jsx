import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'

// Importação de estilos do Swiper
import 'swiper/css'
import 'swiper/css/pagination'

import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <nav className="menu">
          <a href="#">Home</a>
          <a href="#">Perfil</a>
          <a href="#">Usuários</a>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </nav>
      </header>

      {/* Carrossel */}
      <div className="carousel-container">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          spaceBetween={30}
          slidesPerView={1}
        >
          <SwiperSlide>
            <div className="carousel-slide">
              <p>Imagem 1 (Placeholder)</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="carousel-slide">
              <p>Imagem 2 (Placeholder)</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="carousel-slide">
              <p>Imagem 3 (Placeholder)</p>
            </div>
          </SwiperSlide>
        </Swiper>
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
