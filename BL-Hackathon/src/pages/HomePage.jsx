import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { initializeSampleData } from "../data/skillsDB";
import "./HomePage.css";

export function HomePage() {
  const navigate = useNavigate();
  const [soloProfiles, setSoloProfiles] = useState([]);
  const [teamProfiles, setTeamProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileType, setProfileType] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [myProfile, setMyProfile] = useState(null);

  useEffect(() => {
    initializeSampleData();
    
    // Load all profiles
    const solos = JSON.parse(localStorage.getItem("soloProfiles") || "{}");
    const teams = JSON.parse(localStorage.getItem("teamProfiles") || "{}");
    const my = JSON.parse(localStorage.getItem("myProfile") || "{}");

    setSoloProfiles(Object.values(solos));
    setTeamProfiles(Object.values(teams));
    setMyProfile(my);
  }, []);

  const handleSoloClick = (profile) => {
    setSelectedProfile(profile);
    setProfileType("solo");
    
    if (myProfile?.myTeamId) {
      const teams = JSON.parse(localStorage.getItem("teamProfiles") || "{}");
      const myTeam = teams[myProfile.myTeamId];
      if (myTeam) {
        calculateCompatibility(profile.skills, myTeam.skillsNeeded);
      }
    }
  };

  const handleTeamClick = (profile) => {
    setSelectedProfile(profile);
    setProfileType("team");
    
    if (myProfile?.mySoloId) {
      const solos = JSON.parse(localStorage.getItem("soloProfiles") || "{}");
      const mySolo = solos[myProfile.mySoloId];
      if (mySolo) {
        calculateCompatibility(mySolo.skills, profile.skillsNeeded);
      }
    }
  };

  const calculateCompatibility = (userSkills, requiredSkills) => {
    const common = userSkills.filter(s => requiredSkills.includes(s));
    const score = Math.round((common.length / Math.max(userSkills.length, requiredSkills.length)) * 100);
    
    let message = "Skills Differ 🤔";
    if (score >= 80) message = "Great Match! 🔥";
    else if (score >= 60) message = "Good Fit ✨";
    else if (score >= 40) message = "Try It Out 👍";

    setCompatibility({
      score,
      message,
      common_skills: common,
      missing: requiredSkills.filter(s => !userSkills.includes(s))
    });
  };

  const handleSendInvite = () => {
    if (profileType === "solo") {
      if (!myProfile?.myTeamId) {
        alert("❌ Create a team first!");
        navigate("/create-team");
        return;
      }

      const invites = JSON.parse(localStorage.getItem("invites") || "[]");
      invites.push({
        id: `invite-${Date.now()}`,
        from: { type: "team", id: myProfile.myTeamId },
        to: { type: "solo", id: selectedProfile.id },
        soloName: selectedProfile.name,
        teamName: JSON.parse(localStorage.getItem("teamProfiles") || "{}")[myProfile.myTeamId]?.teamName,
        status: "pending",
        createdAt: new Date().toLocaleDateString()
      });
      localStorage.setItem("invites", JSON.stringify(invites));
      alert(`✅ Invite sent to ${selectedProfile.name}!`);
      setSelectedProfile(null);
    } else {
      if (!myProfile?.mySoloId) {
        alert("❌ Create a solo profile first!");
        navigate("/create-profile");
        return;
      }

      const invites = JSON.parse(localStorage.getItem("invites") || "[]");
      invites.push({
        id: `invite-${Date.now()}`,
        from: { type: "solo", id: myProfile.mySoloId },
        to: { type: "team", id: selectedProfile.id },
        soloName: JSON.parse(localStorage.getItem("soloProfiles") || "{}")[myProfile.mySoloId]?.name,
        teamName: selectedProfile.teamName,
        status: "pending",
        createdAt: new Date().toLocaleDateString()
      });
      localStorage.setItem("invites", JSON.stringify(invites));
      alert(`✅ Invite sent to ${selectedProfile.teamName}!`);
      setSelectedProfile(null);
    }
  };

  const closeModal = () => {
    setSelectedProfile(null);
    setProfileType(null);
    setCompatibility(null);
  };

  return (
    <div className="home-page">
      <Navbar />
      
      <div className="home-content">
        <div className="hero">
          <h1>🚀 Find Your Perfect Hackathon Team</h1>
          <p>Browse solo developers and teams, send invites, and build something amazing together</p>
        </div>

        <div className="profiles-container">
          <section className="profile-section">
            <h2>👤 Solo Developers ({soloProfiles.length})</h2>
            <div className="profiles-grid">
              {soloProfiles.map(profile => (
                <div
                  key={profile.id}
                  className="profile-card"
                  onClick={() => handleSoloClick(profile)}
                >
                  <div className="card-avatar">{profile.name?.toUpperCase()}</div>
                  <h3>{profile.name}</h3>
                  <p className="interest">🎯 {profile.interest}</p>
                  <div className="skills-preview">
                    {profile.skills.slice(0, 2).map(s => (
                      <span key={s} className="skill-small">{s}</span>
                    ))}
                    {profile.skills.length > 2 && (
                      <span className="skill-small">+{profile.skills.length - 2}</span>
                    )}
                  </div>
                  <button className="view-btn">View Profile</button>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h2>👥 Teams ({teamProfiles.length})</h2>
            <div className="profiles-grid">
              {teamProfiles.map(profile => (
                <div
                  key={profile.id}
                  className="profile-card team-card"
                  onClick={() => handleTeamClick(profile)}
                >
                  <div className="card-avatar team">👥</div>
                  <h3>{profile.teamName}</h3>
                  <p className="lead">Led by {profile.teamLead}</p>
                  <div className="skills-preview">
                    {profile.skillsNeeded.slice(0, 2).map(s => (
                      <span key={s} className="skill-small needed">{s}</span>
                    ))}
                    {profile.skillsNeeded.length > 2 && (
                      <span className="skill-small">+{profile.skillsNeeded.length - 2}</span>
                    )}
                  </div>
                  <button className="view-btn">View Team</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {selectedProfile && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✕</button>

            {profileType === "solo" ? (
              <>
                <div className="modal-header">
                  <div className="modal-avatar">{selectedProfile.name?.toUpperCase()}</div>
                  <div>
                    <h2>{selectedProfile.name}</h2>
                    <p className="type-badge">👤 Solo Developer</p>
                  </div>
                </div>

                <div className="modal-body">
                  <div className="section">
                    <h3>About</h3>
                    <p>{selectedProfile.bio}</p>
                  </div>

                  <div className="section">
                    <h3>Skills ({selectedProfile.skills.length})</h3>
                    <div className="skills-list">
                      {selectedProfile.skills.map(s => (
                        <span key={s} className="skill-tag">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="section">
                    <h3>Interest</h3>
                    <p>🎯 {selectedProfile.interest}</p>
                  </div>

                  {selectedProfile.discord && (
                    <div className="section">
                      <h3>Contact</h3>
                      <p>💬 Discord: {selectedProfile.discord}</p>
                    </div>
                  )}

                  {compatibility && (
                    <div className={`compatibility-box score-${Math.min(Math.floor(compatibility.score / 20), 4)}`}>
                      <div className="compatibility-header">
                        <div className="score-circle">{compatibility.score}%</div>
                        <div>
                          <p className="score-message">{compatibility.message}</p>
                          <p className="score-hint">Match with your team</p>
                        </div>
                      </div>
                      {compatibility.common_skills.length > 0 && (
                        <div className="match-detail">
                          <strong>✓ Matching Skills:</strong>
                          <div className="skills-match">
                            {compatibility.common_skills.map(s => (
                              <span key={s} className="skill-match">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {compatibility.missing.length > 0 && (
                        <div className="match-detail">
                          <strong>⚠ Team Still Needs:</strong>
                          <div className="skills-missing">
                            {compatibility.missing.map(s => (
                              <span key={s} className="skill-missing">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn-cancel" onClick={closeModal}>Close</button>
                  <button className="btn-invite" onClick={handleSendInvite}>
                    💌 Send Invite
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-avatar team">👥</div>
                  <div>
                    <h2>{selectedProfile.teamName}</h2>
                    <p className="type-badge">👥 Team</p>
                  </div>
                </div>

                <div className="modal-body">
                  <div className="section">
                    <h3>About</h3>
                    <p>{selectedProfile.description}</p>
                  </div>

                  <div className="section">
                    <h3>Team Lead</h3>
                    <p>{selectedProfile.teamLead}</p>
                  </div>

                  <div className="section">
                    <h3>Skills Needed ({selectedProfile.skillsNeeded.length})</h3>
                    <div className="skills-list">
                      {selectedProfile.skillsNeeded.map(s => (
                        <span key={s} className="skill-tag needed">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="section">
                    <h3>Team Size</h3>
                    <p>👥 {selectedProfile.teamSize} members</p>
                  </div>

                  {compatibility && (
                    <div className={`compatibility-box score-${Math.min(Math.floor(compatibility.score / 20), 4)}`}>
                      <div className="compatibility-header">
                        <div className="score-circle">{compatibility.score}%</div>
                        <div>
                          <p className="score-message">{compatibility.message}</p>
                          <p className="score-hint">Match with your skills</p>
                        </div>
                      </div>
                      {compatibility.common_skills.length > 0 && (
                        <div className="match-detail">
                          <strong>✓ Your Matching Skills:</strong>
                          <div className="skills-match">
                            {compatibility.common_skills.map(s => (
                              <span key={s} className="skill-match">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {compatibility.missing.length > 0 && (
                        <div className="match-detail">
                          <strong>⚠ Team Still Needs:</strong>
                          <div className="skills-missing">
                            {compatibility.missing.map(s => (
                              <span key={s} className="skill-missing">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn-cancel" onClick={closeModal}>Close</button>
                  <button className="btn-invite" onClick={handleSendInvite}>
                    💌 Request to Join
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
