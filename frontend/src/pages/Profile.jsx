import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const INTERESTS = [
  "EdTech", "HealthTech", "FinTech", "AI/ML", "SaaS", "E-commerce", 
  "Climate Tech", "PropTech", "FoodTech", "Gaming", "Social Media", "DevTools"
];

const SKILLS = [
  "Product Management", "Software Engineering", "Data Science", "UI/UX Design",
  "Marketing", "Sales", "Business Development", "Finance", "Operations", "Legal"
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    interests: [],
    skills: [],
    businessFocus: "",
    location: ""
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || user.email?.split("@")[0] || "",
        interests: user.profile.interests || [],
        skills: user.profile.skills || [],
        businessFocus: user.profile.businessFocus || "",
        location: user.profile.location || ""
      });
    }
  }, [user]);

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
    setSaved(false);
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar">
          {formData.name?.charAt(0) || "?"}
        </div>
        <div>
          <h1>Your Profile</h1>
          <p className="text-secondary">Personalize your experience to get better partner matches and idea suggestions.</p>
        </div>
      </div>

      <div className="profile-sections">
        {/* Basic Info */}
        <div className="card profile-section">
          <h3>👤 Basic Information</h3>
          <div className="grid two">
            <div className="field">
              <label className="field-label">Display Name</label>
              <input
                className="input"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  setSaved(false);
                }}
                placeholder="Your name"
              />
            </div>
            <div className="field">
              <label className="field-label">Location</label>
              <input
                className="input"
                value={formData.location}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, location: e.target.value }));
                  setSaved(false);
                }}
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Business Focus */}
        <div className="card profile-section">
          <h3>🎯 Business Focus</h3>
          <p className="text-secondary mb-4">Describe what kind of business you're interested in building.</p>
          <textarea
            className="input"
            rows="4"
            value={formData.businessFocus}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, businessFocus: e.target.value }));
              setSaved(false);
            }}
            placeholder="e.g., I want to build AI-powered tools for small businesses to help them with customer service automation..."
          />
        </div>

        {/* Interests */}
        <div className="card profile-section">
          <h3>💡 Industry Interests</h3>
          <p className="text-secondary mb-4">Select the industries you're most interested in.</p>
          <div className="chip-grid">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                className={`chip ${formData.interests.includes(interest) ? 'active' : ''}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card profile-section">
          <h3>🛠️ Your Skills</h3>
          <p className="text-secondary mb-4">Select skills you bring to the table.</p>
          <div className="chip-grid">
            {SKILLS.map(skill => (
              <button
                key={skill}
                className={`chip ${formData.skills.includes(skill) ? 'active' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="save-bar">
        <button 
          className="button large" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: 18, height: 18 }}></span>
              Saving...
            </>
          ) : saved ? (
            <>✓ Saved!</>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>

      <style>{`
        .profile-page {
          max-width: 800px;
          margin: 0 auto;
          padding-bottom: 100px;
        }
        
        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }
        
        .profile-header h1 {
          margin-bottom: 4px;
        }
        
        .profile-sections {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .profile-section {
          padding: 28px;
        }
        
        .profile-section h3 {
          margin-bottom: 16px;
        }
        
        .field {
          margin-bottom: 0;
        }
        
        .field-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        .chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .chip {
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }
        
        .chip:hover {
          border-color: var(--neon-purple);
          color: var(--text-primary);
        }
        
        .chip.active {
          background: var(--gradient-primary);
          border-color: transparent;
          color: white;
        }
        
        .save-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 32px;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: center;
        }
        
        .save-bar .button {
          min-width: 200px;
        }
      `}</style>
    </div>
  );
}
