import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Cadastro from './pages/Cadastro/Cadastro'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home' // Importa a Home
import Perfil from './pages/Perfil/Perfil';
import Usuarios from './pages/Usuarios/Usuarios';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} /> {/* Home adicionada */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </Router>
  )
}

export default App
