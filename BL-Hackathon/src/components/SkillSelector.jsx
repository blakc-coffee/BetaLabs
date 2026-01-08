import { useState } from "react";
import { SKILL_CATEGORIES } from "../data/skillsDB";
import "./SkillSelector.css";

export function SkillSelector({ 
  selectedSkills = [], 
  onSkillsChange = () => {}, 
  label = "Select Skills" 
}) {
  const [activeCategory, setActiveCategory] = useState("Frontend");
  const currentSkills = SKILL_CATEGORIES[activeCategory] || [];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  return (
    <div className="skill-selector">
      <label className="skill-label">{label}</label>
      
      {/* Category Tabs */}
      <div className="category-tabs">
        {Object.keys(SKILL_CATEGORIES).map(category => (
          <button
            key={category}
            className={`tab ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skill Buttons */}
      <div className="skill-buttons">
        {currentSkills.map(skill => (
          <button
            key={skill}
            className={`skill-btn ${selectedSkills.includes(skill) ? "selected" : ""}`}
            onClick={() => toggleSkill(skill)}
            type="button"
          >
            {skill}
            {selectedSkills.includes(skill) && " ✓"}
          </button>
        ))}
      </div>

      {/* Selected List */}
      <div className="selected-list">
        <p>Selected: {selectedSkills.length}</p>
        <div className="tags">
          {selectedSkills.map(skill => (
            <span key={skill} className="tag">
              {skill}
              <button 
                type="button" 
                onClick={() => toggleSkill(skill)}
                className="remove-btn"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
