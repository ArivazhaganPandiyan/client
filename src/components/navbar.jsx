import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedName = window.localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-header">
        
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} className="menu-icon" onClick={toggleMenu} />
      </div>
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/create-recipe" onClick={toggleMenu}>Create Recipe</Link>
        <Link to="/saved-recipes" onClick={toggleMenu}>Saved Recipes</Link>
        {!cookies.access_token ? (
          <Link to="/auth" onClick={toggleMenu}>Login/Register</Link>
        ) : (
          <div className="user-info">
            <span className="user-name">{name}</span>
            <button className="logout-btn" onClick={() => { logout(); toggleMenu(); }}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};
