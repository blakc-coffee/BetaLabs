import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SoloProfileView.css";

export function SoloProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
  const [compatibility, setCompatibility] = useState(null);

  useEffect(() => {
    // Load solo profile
    const soloProfiles = JSON.parse(localStorage.getItem("soloProfiles") || "{}");
    const prof = soloProfiles[id];
    setProfile(prof);

    // Load user's team if exists
    const myProfile = JSON.parse(localStorage.getItem("myProfile") || "{}");
    if (myProfile.myTeamId) {
      const teamProfiles = JSON.parse(localStorage.getItem("teamProfiles") || "{}");
      const team = teamProfiles[myProfile.myTeamId];
      setMyTeam(team);
      
      // Calculate local compatibility (simple match)
      if (prof && team) {
        calculateLocalCompatibility(prof.skills, team.skillsNeeded);
      }
    }
  }, [id]);

  const calculateLocalCompatibility = (userSkills, teamSkills) => {
    const common = userSkills.filter(s => teamSkills.includes(s));
    const score = Math.round((common.length / Math.max(userSkills.length, teamSkills.length)) * 100);
    
    let message = "Skills Differ 🤔";
    if (score >= 80) message = "Great Match! 🔥";
    else if (score >= 60) message = "Good Fit ✨";
    else if (score >= 40) message = "Try It Out 👍";

    setCompatibility({ 
      score, 
      message, 
      common_skills: common,
      user_extra: userSkills.filter(s => !teamSkills.includes(s)),
      team_missing: teamSkills.filter(s => !userSkills.includes(s))
    });
  };

  if (!profile) {
    return (
      <div className="profile-view">
        <div className="profile-card">
          <p className="error">Profile not found</p>
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "fair";
    return "poor";
  };

  const handleInvite = () => {
    if (!myTeam) {
      alert("You need to create a team first!");
      navigate("/create-team");
      return;
    }
    alert(`✅ Invite sent to ${profile.name}! (Feature coming soon)`);
  };

  const handleSave = () => {
    alert(`⭐ ${profile.name} saved! (Feature coming soon)`);
  };

  return (
    <div className="profile-view">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">{profile.name?.toUpperCase()}</div>
          <h1>{profile.name}</h1>
          <p className="type">👤 Solo Contributor</p>
        </div>

        {compatibility && (
          <div className={`compatibility-box ${getScoreColor(compatibility.score)}`}>
            <div className="score-badge">{compatibility.score}%</div>
            <p className="score-message">{compatibility.message}</p>
            
            {compatibility.common_skills.length > 0 && (
              <div className="score-detail">
                <strong>Matching Skills:</strong>
                <div className="skill-list">
                  {compatibility.common_skills.map(s => (
                    <span key={s} className="skill-match">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {compatibility.team_missing.length > 0 && (
              <div className="score-detail">
                <strong>Team Looking For:</strong>
                <div className="skill-list">
                  {compatibility.team_missing.map(s => (
                    <span key={s} className="skill-needed">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <section className="profile-section">
          <h2>About</h2>
          <p>{profile.bio}</p>
        </section>

        {profile.skills && profile.skills.length > 0 && (
          <section className="profile-section">
            <h2>Skills ({profile.skills.length})</h2>
            <div className="skill-grid">
              {profile.skills.map(s => (
                <span key={s} className="skill-badge">{s}</span>
              ))}
            </div>
          </section>
        )}

        {profile.interest && (
          <section className="profile-section">
            <h2>Interested In</h2>
            <p className="interest-text">🎯 {profile.interest}</p>
          </section>
        )}

        {(profile.discord || profile.linkedin) && (
          <section className="profile-section">
            <h2>Contact</h2>
            <div className="contact-info">
              {profile.discord && (
                <div className="contact-item">
                  <span className="contact-label">💬 Discord:</span>
                  <span>{profile.discord}</span>
                </div>
              )}
              {profile.linkedin && (
                <div className="contact-item">
                  <span className="contact-label">🔗 LinkedIn:</span>
                  <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer">
                    {profile.linkedin}
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="profile-actions">
          <button className="btn-primary" onClick={handleInvite}>
            💌 Invite to Team
          </button>
          <button className="btn-secondary" onClick={handleSave}>
            ⭐ Save Profile
          </button>
        </div>

        <div className="profile-meta">
          <small>Created: {profile.createdAt}</small>
        </div>
      </div>
    </div>
  );
}
