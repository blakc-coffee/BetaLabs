import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import "./MyProfiles.css";

export function MyProfiles() {
  const navigate = useNavigate();
  const [mySoloProfile, setMySoloProfile] = useState(null);
  const [myTeamProfile, setMyTeamProfile] = useState(null);
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);
  const [activeTab, setActiveTab] = useState("profiles");
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [compatibility, setCompatibility] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const myProfile = JSON.parse(localStorage.getItem("myProfile") || "{}");

    if (myProfile.mySoloId) {
      const solos = JSON.parse(localStorage.getItem("soloProfiles") || "{}");
      setMySoloProfile(solos[myProfile.mySoloId]);
    }

    if (myProfile.myTeamId) {
      const teams = JSON.parse(localStorage.getItem("teamProfiles") || "{}");
      setMyTeamProfile(teams[myProfile.myTeamId]);
    }

    const allInvites = JSON.parse(localStorage.getItem("invites") || "[]");
    
    const received = allInvites.filter(inv => 
      (inv.to.type === "solo" && inv.to.id === myProfile.mySoloId) ||
      (inv.to.type === "team" && inv.to.id === myProfile.myTeamId)
    );
    setReceivedInvites(received);

    const sent = allInvites.filter(inv => 
      (inv.from.type === "solo" && inv.from.id === myProfile.mySoloId) ||
      (inv.from.type === "team" && inv.from.id === myProfile.myTeamId)
    );
    setSentInvites(sent);
  };

  const handleInviteClick = (invite) => {
    setSelectedInvite(invite);

    if (invite.to.type === "solo") {
      const solos = JSON.parse(localStorage.getItem("soloProfiles") || "{}");
      const solo = solos[invite.to.id];
      const teams = JSON.parse(localStorage.getItem("teamProfiles") || "{}");
      const team = teams[invite.from.id];

      if (solo && team) {
        const common = solo.skills.filter(s => team.skillsNeeded.includes(s));
        const score = Math.round((common.length / Math.max(solo.skills.length, team.skillsNeeded.length)) * 100);
        setCompatibility({
          score,
          common_skills: common,
          missing: team.skillsNeeded.filter(s => !solo.skills.includes(s))
        });
      }
    } else {
      const solos = JSON.parse(localStorage.getItem("soloProfiles") || "{}");
      const solo = solos[invite.from.id];
      const teams = JSON.parse(localStorage.getItem("teamProfiles") || "{}");
      const team = teams[invite.to.id];

      if (solo && team) {
        const common = solo.skills.filter(s => team.skillsNeeded.includes(s));
        const score = Math.round((common.length / Math.max(solo.skills.length, team.skillsNeeded.length)) * 100);
        setCompatibility({
          score,
          common_skills: common,
          missing: team.skillsNeeded.filter(s => !solo.skills.includes(s))
        });
      }
    }
  };

  const handleInviteResponse = (inviteId, accept) => {
    const invites = JSON.parse(localStorage.getItem("invites") || "[]");
    const updated = invites.map(inv => 
      inv.id === inviteId ? { ...inv, status: accept ? "accepted" : "rejected" } : inv
    );
    localStorage.setItem("invites", JSON.stringify(updated));
    loadProfiles();
    setSelectedInvite(null);
    setCompatibility(null);
  };

  return (
    <div className="my-profiles-page">
      <Navbar />

      <div className="my-profiles-content">
        <h1>My Profiles & Invites</h1>

        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === "profiles" ? "active" : ""}`}
            onClick={() => setActiveTab("profiles")}
          >
            My Profiles
          </button>
          <button 
            className={`tab-btn ${activeTab === "received" ? "active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            Received Invites ({receivedInvites.filter(i => i.status === "pending").length})
          </button>
          <button 
            className={`tab-btn ${activeTab === "sent" ? "active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            Sent Invites ({sentInvites.filter(i => i.status === "pending").length})
          </button>
        </div>

        {activeTab === "profiles" && (
          <div className="tab-content">
            {!mySoloProfile && !myTeamProfile ? (
              <div className="empty-state">
                <p>No profiles created yet</p>
                <div className="empty-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => navigate("/create-profile")}
                  >
                    Create Solo Profile
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => navigate("/create-team")}
                  >
                    Create Team Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="profiles-grid">
                {mySoloProfile && (
                  <div className="profile-box">
                    <div className="profile-avatar">{mySoloProfile.name?.toUpperCase()}</div>
                    <h3>{mySoloProfile.name}</h3>
                    <p className="type">👤 Solo Profile</p>
                    <p className="bio">{mySoloProfile.bio}</p>
                    <div className="skills">
                      {mySoloProfile.skills.map(s => (
                        <span key={s} className="skill">{s}</span>
                      ))}
                    </div>
                    <p className="interest">Interest: {mySoloProfile.interest}</p>
                  </div>
                )}

                {myTeamProfile && (
                  <div className="profile-box">
                    <div className="profile-avatar team">👥</div>
                    <h3>{myTeamProfile.teamName}</h3>
                    <p className="type">👥 Team Profile</p>
                    <p className="lead">Led by {myTeamProfile.teamLead}</p>
                    <p className="bio">{myTeamProfile.description}</p>
                    <div className="skills">
                      {myTeamProfile.skillsNeeded.map(s => (
                        <span key={s} className="skill needed">{s}</span>
                      ))}
                    </div>
                    <p className="team-size">Size: {myTeamProfile.teamSize}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "received" && (
          <div className="tab-content">
            {receivedInvites.length === 0 ? (
              <div className="empty-state">
                <p>No invites received yet</p>
              </div>
            ) : (
              <div className="invites-list">
                {receivedInvites.map(invite => (
                  <div 
                    key={invite.id}
                    className={`invite-card ${invite.status}`}
                    onClick={() => handleInviteClick(invite)}
                  >
                    <div className="invite-header">
                      <h3>
                        {invite.from.type === "team" 
                          ? `${invite.teamName} sent you an invite` 
                          : `${invite.soloName} wants to join your team`}
                      </h3>
                      <span className={`status-badge ${invite.status}`}>
                        {invite.status === "pending" ? "⏳ Pending" : 
                         invite.status === "accepted" ? "✅ Accepted" : 
                         "❌ Rejected"}
                      </span>
                    </div>
                    <p className="date">Received: {invite.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "sent" && (
          <div className="tab-content">
            {sentInvites.length === 0 ? (
              <div className="empty-state">
                <p>No invites sent yet</p>
              </div>
            ) : (
              <div className="invites-list">
                {sentInvites.map(invite => (
                  <div 
                    key={invite.id}
                    className={`invite-card ${invite.status}`}
                  >
                    <div className="invite-header">
                      <h3>
                        {invite.to.type === "solo" 
                          ? `Invited ${invite.soloName}` 
                          : `Applied to ${invite.teamName}`}
                      </h3>
                      <span className={`status-badge ${invite.status}`}>
                        {invite.status === "pending" ? "⏳ Pending" : 
                         invite.status === "accepted" ? "✅ Accepted" : 
                         "❌ Rejected"}
                      </span>
                    </div>
                    <p className="date">Sent: {invite.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedInvite && (
        <div className="modal-overlay" onClick={() => setSelectedInvite(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedInvite(null)}>✕</button>

            <div className="modal-content">
              <h2>
                {selectedInvite.from.type === "team"
                  ? `Invite from ${selectedInvite.teamName}`
                  : `Request from ${selectedInvite.soloName}`}
              </h2>

              {compatibility && (
                <div className={`compatibility-box score-${Math.min(Math.floor(compatibility.score / 20), 4)}`}>
                  <div className="score-circle">{compatibility.score}%</div>
                  <p className="message">Match Score</p>
                  {compatibility.common_skills.length > 0 && (
                    <div className="match-details">
                      <strong>✓ Matching:</strong>
                      <div className="skills">
                        {compatibility.common_skills.map(s => (
                          <span key={s} className="skill-match">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {compatibility.missing.length > 0 && (
                    <div className="match-details">
                      <strong>⚠ Still Needed:</strong>
                      <div className="skills">
                        {compatibility.missing.map(s => (
                          <span key={s} className="skill-missing">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedInvite.status === "pending" && (
                <div className="invite-actions">
                  <button 
                    className="btn-reject"
                    onClick={() => handleInviteResponse(selectedInvite.id, false)}
                  >
                    Reject
                  </button>
                  <button 
                    className="btn-accept"
                    onClick={() => handleInviteResponse(selectedInvite.id, true)}
                  >
                    Accept ✓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
