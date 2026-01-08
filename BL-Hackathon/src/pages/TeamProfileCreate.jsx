import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SkillSelector } from "../components/SkillSelector";
import "./TeamProfileCreate.css";

export function TeamProfileCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    teamName: "",
    description: "",
    teamLead: "",
    skillsNeeded: [],
    teamSize: "3-4"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.teamName || !form.description || form.skillsNeeded.length === 0 || !form.teamLead) {
      alert("Please fill all required fields");
      return;
    }

    // Save to localStorage
    const teams = JSON.parse(localStorage.getItem("teamProfiles") || "{}");
    const id = `team-${Date.now()}`;
    teams[id] = {
      ...form,
      id,
      type: "team",
      createdAt: new Date().toLocaleDateString()
    };
    localStorage.setItem("teamProfiles", JSON.stringify(teams));

    // Save my team ID
    const myProfile = JSON.parse(localStorage.getItem("myProfile") || "{}");
    myProfile.myTeamId = id;
    localStorage.setItem("myProfile", JSON.stringify(myProfile));

    alert("✅ Team created!");
    navigate(`/team/${id}`);
  };

  return (
    <div className="create-team-container">
      <div className="form-box">
        <h1>Create Team Profile</h1>
        <p className="form-subtitle">Assemble your hackathon team</p>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-field">
            <label>Team Name *</label>
            <input
              type="text"
              value={form.teamName}
              onChange={(e) => setForm({...form, teamName: e.target.value})}
              placeholder="e.g., Code Warriors"
            />
          </div>

          <div className="form-field">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              placeholder="What is your team about? What are you building?"
              rows="4"
            />
          </div>

          <div className="form-field">
            <label>Team Lead Name *</label>
            <input
              type="text"
              value={form.teamLead}
              onChange={(e) => setForm({...form, teamLead: e.target.value})}
              placeholder="Your name"
            />
          </div>

          <SkillSelector
            selectedSkills={form.skillsNeeded}
            onSkillsChange={(skills) => setForm({...form, skillsNeeded: skills})}
            label="Skills You're Looking For *"
          />

          <div className="form-field">
            <label>Target Team Size</label>
            <select 
              value={form.teamSize}
              onChange={(e) => setForm({...form, teamSize: e.target.value})}
            >
              <option value="2-3">2-3 People</option>
              <option value="3-4">3-4 People</option>
              <option value="4-5">4-5 People</option>
              <option value="5+">5+ People</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
