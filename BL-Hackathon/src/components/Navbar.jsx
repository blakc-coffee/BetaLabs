import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-logo" onClick={() => navigate("/")}>
          🚀 HackMate
        </button>
      </div>
      <div className="navbar-right">
        <button className="nav-btn" onClick={() => navigate("/")}>
          Home
        </button>
        <button className="nav-btn" onClick={() => navigate("/my-profiles")}>
          My Profiles
        </button>
      </div>
    </nav>
  );
}
