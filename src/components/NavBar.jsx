import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem('userId');

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
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
                Home
              </Link>
            </li>
            
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="loginDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Login
              </a>
              <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                <li>
                  <Link className="dropdown-item" to="/SignIn">
                    User Login
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/AdminLogin">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="registerDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Register
              </a>
              <ul className="dropdown-menu" aria-labelledby="registerDropdown">
                <li>
                  <Link className="dropdown-item" to="/UserRegister">
                    User Register
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/AdminRegister">
                    Admin Register
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/HowToUse">
                How to Use
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AboutUs">
                About Us
              </Link>
            </li>
          </ul>
          {isLoggedIn && (
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Enhanced CSS */}
      <style jsx>{`
        .navbar {
          background: linear-gradient(90deg, #007bff, #00c4cc);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          padding: 1rem 2rem;
        }

        .navbar-brand {
          font-size: 1.5rem;
          font-weight: bold;
          letter-spacing: 1px;
          color: #fff;
          transition: color 0.3s ease;
        }

        .navbar-brand:hover {
          color: #f8f9fa;
        }

        .navbar-nav .nav-link {
          color: #fff;
          font-weight: 500;
          font-size: 1.1rem;
          padding: 0.5rem 1rem;
          transition: color 0.3s ease, background-color 0.3s ease;
        }

        .navbar-nav .nav-link:hover {
          color: #e9ecef;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
        }

        .dropdown-menu {
          background-color: #fff;
          border: none;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
        }

        .dropdown-item {
          color: #333;
          font-weight: 500;
          padding: 0.5rem 1.5rem;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .dropdown-item:hover {
          background-color: #007bff;
          color: #fff;
        }

        .btn-outline-light {
          border-color: #fff;
          color: #fff;
          font-weight: 500;
          padding: 0.5rem 1.5rem;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .btn-outline-light:hover {
          background-color: #fff;
          color: #007bff;
        }

        @media (max-width: 991px) {
          .navbar-nav {
            padding-top: 1rem;
          }

          .navbar-nav .nav-item {
            margin-bottom: 0.5rem;
          }

          .btn-outline-light {
            width: 100%;
            text-align: center;
            margin-top: 1rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default NavBar;