import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    setIsAuthenticated(!!refreshToken);
  };

  const handleDashboardAccess = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <ul>
          <li><Link to="/">Home</Link></li>
          {!isAuthenticated ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <li><button onClick={handleDashboardAccess}>Dashboard</button></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
