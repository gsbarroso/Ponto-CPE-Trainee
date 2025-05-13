import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import './Login.css' // Criaremos este arquivo depois

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>LOGIN</h1>

        <form>
          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="exemplo@empresa.com" />
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

          <button type="submit" className="btn-login">
            ENTRAR
          </button>
        </form>

        <p className="register-link">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se aqui</Link>
        </p>
      </div>
    </div>
  )
}