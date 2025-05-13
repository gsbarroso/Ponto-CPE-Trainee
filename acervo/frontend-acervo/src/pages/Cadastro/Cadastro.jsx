import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import './Cadastro.css'

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h1>CADASTRO</h1>

        <form>
          {/* Nome */}
          <div className="input-group">
            <label>Nome</label>
            <input type="text" placeholder="Digite seu nome completo" />
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="exemplo@empresa.com" />
          </div>

          {/* Cargo */}
          <div className="input-group">
            <label>Cargo</label>
            <input type="text" placeholder="Seu cargo na empresa" />
          </div>

          {/* Senha */}
          <div className="input-group password-group">
            <label>Senha</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div className="input-group password-group">
            <label>Confirme sua Senha</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-cadastrar">
            CRIAR CONTA
          </button>
        </form>

        <p className="login-link">
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>
        </p>
      </div>
    </div>
  )
}