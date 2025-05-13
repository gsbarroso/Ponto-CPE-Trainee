import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Cadastro from './pages/Cadastro/Cadastro'
import Login from './pages/Login/Login'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* Rota padrão */}
      </Routes>
    </Router>
  )
}

export default App