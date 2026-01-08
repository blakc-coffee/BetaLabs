import { useNavigate } from "react-router-dom";
import "./Home.css";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-container">
        <h1>🚀 HackMate</h1>
        <p className="tagline">Find your perfect hackathon team</p>
        
        <div className="action-buttons">
          <button className="btn-primary" onClick={() => navigate("/create-profile")}>
            👤 Create Solo Profile
          </button>
          <button className="btn-secondary" onClick={() => navigate("/create-team")}>
            👥 Create Team Profile
          </button>
        </div>

        <div className="info-section">
          <h2>How it works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Profile</h3>
              <p>Add your skills and interests</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Find Match</h3>
              <p>Get compatibility scores</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Connect</h3>
              <p>Invite and build together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
