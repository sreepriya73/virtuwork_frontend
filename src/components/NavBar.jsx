import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    sessionStorage.removeItem('userId');
    navigate('/'); // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#">
          VIRTUWORK
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
               HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/UserRegister">
                SIGN UP
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/SignIn">
              SIGN IN
              </Link>
            </li>
           
          </ul>
          {/* Logout button */}
          <button
            className="btn btn-outline-light" // Bootstrap classes for styling
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* CSS for enhanced styling */}
      <style jsx>{`
        .navbar {
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }

        .navbar-nav .nav-link {
          font-weight: 500;
          font-size: 1rem;
        }

        .navbar-nav .nav-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
