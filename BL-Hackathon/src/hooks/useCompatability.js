import { useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function useCompatibility() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateCompatibility = async (userSkills, teamSkills) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/compatibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSkills, teamSkills })
      });

      if (!response.ok) throw new Error("Backend error");
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      // Fallback: local calculation
      return localMatch(userSkills, teamSkills);
    }
  };

  const localMatch = (userSkills, teamSkills) => {
    const common = userSkills.filter(s => teamSkills.includes(s));
    const score = Math.round((common.length / Math.max(userSkills.length, teamSkills.length)) * 100);
    
    let msg = "Skills Differ 🤔";
    if (score >= 80) msg = "Great Match! 🔥";
    else if (score >= 60) msg = "Good Fit ✨";
    else if (score >= 40) msg = "Try It Out 👍";

    return { score, message: msg, details: { common_skills: common } };
  };

  return { calculateCompatibility, loading, error };
}
