import { Link, NavLink } from 'react-router'
import '../assets/comp-styles/NavBar.css'

export default function NavBar() {
    const getNavLinkClass = ({ isActive }) =>
        `navbar-link ${isActive ? 'navbar-link-active' : ''}`

    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <div className="navbar-brand-wrapper">
                    <Link to="/" className="navbar-brand-link">VINSHADES</Link>
                </div>
                <nav className="navbar-menu">
                    <NavLink to="/" className={getNavLinkClass}>Home</NavLink>
                    <NavLink to="/games" className={getNavLinkClass}>Games</NavLink>
                    <NavLink to="/about" className={getNavLinkClass}>About</NavLink>
                    <NavLink to="/contact" className={getNavLinkClass}>Contact</NavLink>
                </nav>
                <div className="navbar-actions">
                    <Link to="/register" className="navbar-btn-signin">Sign In</Link>
                    <Link to="/login" className="navbar-btn-login">Login</Link>
                </div>
            </div>
        </header>
    )
}