import './Cadastro.css'

export default function Cadastro() {
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
          <div className="input-group">
            <label>Senha</label>
            <input type="password" placeholder="••••••••" />
          </div>

          {/* Confirmar Senha */}
          <div className="input-group">
            <label>Confirme sua Senha</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-cadastrar">
            CRIAR CONTA
          </button>
        </form>

        <p className="login-link">
          Já tem uma conta? <a href="/login">Faça login aqui</a>
        </p>
      </div>
    </div>
  )
}