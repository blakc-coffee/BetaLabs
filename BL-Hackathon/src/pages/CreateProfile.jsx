// src/pages/CreateProfile.jsx
// Solo profile creation with enhanced skill selection

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SkillSelector } from "../components/SkillSelector";
import { addSoloProfile } from "../data/soloProfiles";
import { setMySoloId, getMySoloId } from "../data/myProfile";
import "./CreateProfile.css";

export function CreateProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [interestedIn, setInterestedIn] = useState("");
  const [discord, setDiscord] = useState("");
  const [linkedinId, setLinkedinId] = useState("");

  const handleCreate = () => {
    const existingSoloId = getMySoloId();
    if (existingSoloId) {
      alert("❌ You can only create ONE solo profile! Edit your existing one.");
      return;
    }

    if (!name?.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!bio?.trim()) {
      alert("Please enter your bio");
      return;
    }
    if (skills.length === 0) {
      alert("Please select at least one skill");
      return;
    }
    if (!interestedIn?.trim()) {
      alert("Please select what you're interested in");
      return;
    }

    const newProfile = {
      id: `solo-${Date.now()}`,
      name: name.trim(),
      type: "solo",
      bio: bio.trim(),
      skills: skills,
      interestedIn: interestedIn.trim(),
      discord: discord.trim() || "Not provided",
      linkedinId: linkedinId.trim() || "Not provided",
      createdAt: new Date().toLocaleDateString()
    };

    const profileId = addSoloProfile(newProfile);
    setMySoloId(profileId);
    alert("✅ Profile created successfully!");
    navigate("/my-profile");
  };

  return (
    <>
      <div className="create-profile-container">
        <div className="form-wrapper">
          <h1>Create Your Solo Profile</h1>
          <p className="form-subtitle">
            Tell the hackathon community about yourself
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Alex Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio *</label>
              <textarea
                className="form-control"
                placeholder="Tell us about yourself, experience, and interests"
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <SkillSelector
              selectedSkills={skills}
              onSkillsChange={setSkills}
              label="Your Skills *"
            />

            <div className="form-group">
              <label className="form-label">What are you interested in? *</label>
              <select
                className="form-control"
                value={interestedIn}
                onChange={(e) => setInterestedIn(e.target.value)}
              >
                <option value="">Select an interest...</option>
                <option value="Full-Stack">Full-Stack Development</option>
                <option value="Frontend">Frontend Development</option>
                <option value="Backend">Backend Development</option>
                <option value="AI/ML">AI & Machine Learning</option>
                <option value="DevOps">DevOps & Infrastructure</option>
                <option value="Design">UI/UX Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Discord Handle</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., alex#1234"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., alexchen"
                value={linkedinId}
                onChange={(e) => setLinkedinId(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => navigate("/my-profile")}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleCreate}
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
