import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SkillSelector } from "../components/SkillSelector";
import "./SoloProfileCreate.css";

export function SoloProfileCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: [],
    interest: "",
    discord: "",
    linkedin: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.name || !form.bio || form.skills.length === 0 || !form.interest) {
      alert("Please fill all required fields");
      return;
    }

    // Save to localStorage
    const profiles = JSON.parse(localStorage.getItem("soloProfiles") || "{}");
    const id = `solo-${Date.now()}`;
    profiles[id] = { 
      ...form, 
      id, 
      type: "solo",
      createdAt: new Date().toLocaleDateString() 
    };
    localStorage.setItem("soloProfiles", JSON.stringify(profiles));
    
    // Save my profile ID
    const myProfile = JSON.parse(localStorage.getItem("myProfile") || "{}");
    myProfile.mySoloId = id;
    localStorage.setItem("myProfile", JSON.stringify(myProfile));

    alert("✅ Profile created!");
    navigate(`/profile/${id}`);
  };

  return (
    <div className="create-solo-container">
      <div className="form-box">
        <h1>Create Your Solo Profile</h1>
        <p className="form-subtitle">Join the hackathon community</p>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-field">
            <label>Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              placeholder="Your full name"
            />
          </div>

          <div className="form-field">
            <label>Bio *</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({...form, bio: e.target.value})}
              placeholder="Tell us about yourself and your interests"
              rows="4"
            />
          </div>

          <SkillSelector
            selectedSkills={form.skills}
            onSkillsChange={(skills) => setForm({...form, skills})}
            label="Your Skills *"
          />

          <div className="form-field">
            <label>What are you interested in? *</label>
            <select 
              value={form.interest}
              onChange={(e) => setForm({...form, interest: e.target.value})}
            >
              <option value="">Select an interest...</option>
              <option value="Frontend">Frontend Development</option>
              <option value="Backend">Backend Development</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="AI/ML">AI & Machine Learning</option>
              <option value="DevOps">DevOps & Infrastructure</option>
              <option value="Design">UI/UX Design</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>

          <div className="form-field">
            <label>Discord (optional)</label>
            <input
              type="text"
              value={form.discord}
              onChange={(e) => setForm({...form, discord: e.target.value})}
              placeholder="username#1234"
            />
          </div>

          <div className="form-field">
            <label>LinkedIn (optional)</label>
            <input
              type="text"
              value={form.linkedin}
              onChange={(e) => setForm({...form, linkedin: e.target.value})}
              placeholder="linkedin username"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
