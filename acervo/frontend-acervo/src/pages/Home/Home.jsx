import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import img1 from '../../assets/img1.jpg'
import img2 from '../../assets/img2.jpg'
import img3 from '../../assets/img3.jpg'


// Importação de estilos do Swiper
import 'swiper/css'
import 'swiper/css/pagination'

import './Home.css'

export default function Home() {
  const navigate = useNavigate()

const handleLogout = () => {
  navigate('/')
}

const goToPerfil = () => {
  navigate('/perfil')
}

const goToUsuarios = () => {
  navigate('/usuarios')
}

const goToHome = () => {
  navigate('/home')
}

return (
  <div className="home-container">
    {/* Header */}
    <header className="home-header">
      <nav className="menu">
        <button onClick={goToHome} className="nav-btn">Home</button>
        <button onClick={goToPerfil} className="nav-btn">Perfil</button>
        <button onClick={goToUsuarios} className="nav-btn">Usuários</button>
        <button onClick={handleLogout} className="logout-btn">Sair</button>
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
      <img src={img1} alt="Imagem 1" className="carousel-image" />
    </div>
  </SwiperSlide>
  <SwiperSlide>
    <div className="carousel-slide">
      <img src={img2} alt="Imagem 2" className="carousel-image" />
    </div>
  </SwiperSlide>
  <SwiperSlide>
    <div className="carousel-slide">
      <img src={img3} alt="Imagem 3" className="carousel-image" />
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
                  <strong>Gustavo Silvestre</strong>
                  <div className="subtext">Trainee</div>
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