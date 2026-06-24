import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand" end>
        Gerenciamento de Livros
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/" end>
          Listagem
        </NavLink>
        <NavLink to="/cadastro">
          Cadastrar
        </NavLink>
      </div>
    </nav>
  );
}
