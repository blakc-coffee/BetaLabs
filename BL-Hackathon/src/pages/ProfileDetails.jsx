// src/pages/ProfileDetails.jsx
// Display solo profile with compatibility scoring

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSoloProfileById } from "../data/soloProfiles";
import { getTeamProfileById } from "../data/teamProfiles";
import { getMyTeamId } from "../data/myProfile";
import { useCompatibility } from "../hooks/useCompatibility";
import "./ProfileDetails.css";

export function ProfileDetails() {
  const { id } = useParams();
  const myTeamId = getMyTeamId();
  const { calculateCompatibility, loading } = useCompatibility();

  const soloUser = getSoloProfileById(id);
  const profile = soloUser;

  const [compatibilityScore, setCompatibilityScore] = useState(null);
  const [compatibilityDetails, setCompatibilityDetails] = useState(null);

  useEffect(() => {
    const calculateScore = async () => {
      if (!myTeamId || !profile?.skills) {
        setCompatibilityScore(null);
        return;
      }

      const myTeam = getTeamProfileById(myTeamId);
      if (!myTeam || !myTeam.skillsNeeded) {
        setCompatibilityScore(null);
        return;
      }

      try {
        const result = await calculateCompatibility(
          profile.skills,
          myTeam.skillsNeeded
        );

        setCompatibilityScore(result.score);
        setCompatibilityDetails(result);
      } catch (err) {
        console.error("Error calculating compatibility:", err);
      }
    };

    calculateScore();
  }, [id, myTeamId, profile?.skills, calculateCompatibility]);

  if (!profile) {
    return (
      <div className="profile-detail-container">
        <div className="error-message">Profile not found</div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-fair";
    return "score-poor";
  };

  return (
    <div className="profile-detail-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-type">
              {profile.type === "solo" ? "👤 Solo Contributor" : "👥 Team"}
            </p>
          </div>
        </div>

        {compatibilityScore !== null && (
          <div className={`compatibility-section ${getScoreColor(compatibilityScore)}`}>
            <div className="compatibility-header">
              <span className="compatibility-label">Team Compatibility</span>
              <span className="compatibility-percentage">
                {compatibilityScore}%
              </span>
            </div>
            <p className="compatibility-message">
              {compatibilityDetails?.message}
            </p>

            {compatibilityDetails?.details && (
              <div className="compatibility-details">
                {compatibilityDetails.details.common_skills?.length > 0 && (
                  <div className="detail-item">
                    <span className="detail-label">Matching Skills:</span>
                    <div className="skill-list">
                      {compatibilityDetails.details.common_skills.map(skill => (
                        <span key={skill} className="skill-tag skill-tag--match">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {compatibilityDetails.details.team_missing_skills?.length > 0 && (
                  <div className="detail-item">
                    <span className="detail-label">Team Looking For:</span>
                    <div className="skill-list">
                      {compatibilityDetails.details.team_missing_skills.map(skill => (
                        <span key={skill} className="skill-tag skill-tag--needed">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="profile-content">
          <section className="profile-section">
            <h2 className="section-title">About</h2>
            <p className="profile-bio">{profile.bio}</p>
          </section>

          {profile.skills && profile.skills.length > 0 && (
            <section className="profile-section">
              <h2 className="section-title">Skills</h2>
              <div className="skills-grid">
                {profile.skills.map(skill => (
                  <span key={skill} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {profile.interestedIn && (
            <section className="profile-section">
              <h2 className="section-title">Interested In</h2>
              <div className="profile-detail">
                <span className="detail-icon">🎯</span>
                <span>{profile.interestedIn}</span>
              </div>
            </section>
          )}

          <section className="profile-section">
            <h2 className="section-title">Contact</h2>
            <div className="contact-grid">
              {profile.discord && profile.discord !== "Not provided" && (
                <a
                  href={`https://discordapp.com/users/`}
                  className="contact-link"
                  title="Discord"
                >
                  💬 {profile.discord}
                </a>
              )}

              {profile.linkedinId && profile.linkedinId !== "Not provided" && (
                <a
                  href={`https://linkedin.com/in/${profile.linkedinId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  title="LinkedIn"
                >
                  🔗 LinkedIn
                </a>
              )}
            </div>
          </section>

          <div className="profile-actions">
            {myTeamId ? (
              <button className="btn btn--primary" disabled={loading}>
                {loading ? "Calculating..." : `💌 Invite to Team`}
              </button>
            ) : (
              <p className="action-hint">
                Create a team to invite this person
              </p>
            )}

            <button className="btn btn--secondary">⭐ Save Profile</button>
          </div>
        </div>

        <div className="profile-footer">
          <small>Profile created: {profile.createdAt}</small>
        </div>
      </div>
    </div>
  );
}
