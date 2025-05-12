import './Header.css'
import logo from '../../assets/logo.png' // Ajuste o caminho conforme sua estrutura

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <img 
          src={logo} 
          alt="Logo do Sistema" 
          className="header-logo"
        />
      </div>
    </header>
  )
}