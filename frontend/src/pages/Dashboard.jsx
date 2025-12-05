import { useState } from "react";
import { api } from "../services/api";
import IdeaCard from "../components/IdeaCard";
import MarketInsights from "../components/MarketInsights";
import CompetitorPanel from "../components/CompetitorPanel";
import ValidationScore from "../components/ValidationScore";
import RiskAssessment from "../components/RiskAssessment";
import PartnerSuggestions from "../components/PartnerSuggestions";

const INDUSTRIES = [
  { id: "edtech", name: "EdTech", icon: "📚", desc: "Education & Learning" },
  { id: "fintech", name: "FinTech", icon: "💳", desc: "Finance & Payments" },
  { id: "healthtech", name: "HealthTech", icon: "🏥", desc: "Healthcare & Wellness" },
  { id: "ai", name: "AI/ML", icon: "🤖", desc: "Artificial Intelligence" },
  { id: "saas", name: "SaaS", icon: "☁️", desc: "Software as a Service" },
  { id: "ecommerce", name: "E-commerce", icon: "🛒", desc: "Online Retail" },
  { id: "foodtech", name: "FoodTech", icon: "🍕", desc: "Food & Delivery" },
  { id: "devtools", name: "Developer Tools", icon: "⚙️", desc: "Dev Infrastructure" },
  { id: "productivity", name: "Productivity", icon: "📊", desc: "Work & Collaboration" },
  { id: "communication", name: "Communication", icon: "💬", desc: "Messaging & Social" },
];

export default function Dashboard() {
  const [step, setStep] = useState(1);
  const [ideaText, setIdeaText] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("market");

  const generateIdeas = async () => {
    if (!ideaText.trim() || !selectedIndustry) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/ideas/generate", {
        idea: `[Industry: ${selectedIndustry.name}] ${ideaText}`
      });
      setIdeas(data.ideas || []);
      setStep(2);
    } catch (err) {
      console.error("Generation failed:", err);
      setError("Failed to generate ideas. Please try again.");
    }
    setLoading(false);
  };

  const selectIdea = async (idea) => {
    setSelectedIdea(idea);
    setLoading(true);
    setError(null);

    try {
      // Prepare the idea payload (must match RefinedIdea schema)
      const ideaPayload = {
        name: idea.name,
        problem: idea.problem,
        solution: idea.solution,
        value_proposition: idea.value_proposition,
      };

      // Make API calls sequentially to avoid issues
      console.log("[DEBUG] Fetching market insights...");
      const marketRes = await api.post("/ideas/insights", ideaPayload);
      console.log("[DEBUG] Market insights:", marketRes.data);

      console.log("[DEBUG] Fetching competitors...");
      const compRes = await api.post("/ideas/competitors", ideaPayload);
      console.log("[DEBUG] Competitors:", compRes.data);

      console.log("[DEBUG] Fetching risk assessment...");
      const riskRes = await api.post("/ideas/assessment", ideaPayload);
      console.log("[DEBUG] Risks:", riskRes.data);

      console.log("[DEBUG] Fetching validation score...");
      const validateRes = await api.post("/ideas/validate", {
        idea: ideaPayload,
        market: marketRes.data,
        competitors: compRes.data,
      });
      console.log("[DEBUG] Validation:", validateRes.data);

      console.log("[DEBUG] Fetching partner suggestions...");
      let partnersData = [];
      try {
        const partnerRes = await api.get("/partners/suggest");
        partnersData = partnerRes.data || [];
      } catch (partnerErr) {
        console.warn("[WARN] Partners fetch failed, using empty:", partnerErr);
      }

      setInsights({
        market: marketRes.data,
        competitors: compRes.data,
        risks: riskRes.data,
        scores: validateRes.data,
        partners: partnersData,
        industry: selectedIndustry,
      });

      setStep(3);
      console.log("[DEBUG] Successfully moved to step 3");

    } catch (err) {
      console.error("[ERROR] Analysis failed:", err);
      console.error("[ERROR] Response:", err.response?.data);
      setError(`Analysis failed: ${err.response?.data?.detail || err.message}`);
    }
    setLoading(false);
  };

  const resetFlow = () => {
    setStep(1);
    setIdeaText("");
    setSelectedIndustry(null);
    setIdeas([]);
    setSelectedIdea(null);
    setInsights(null);
    setError(null);
  };

  return (
    <div className="dashboard">
      {/* Progress Steps */}
      <div className="steps-container">
        <div className="steps">
          <div className={`step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
            <span className="step-number">1</span>
            <span className="step-label">Define Idea</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">Select Refined</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span className="step-number">3</span>
            <span className="step-label">View Insights</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Step 1: Industry Selection + Idea Input */}
      {step === 1 && (
        <div className="step-content">
          {/* Industry Selector */}
          <div className="card mb-6">
            <div className="section-header">
              <div className="icon">🎯</div>
              <div>
                <h3>Select Your Industry</h3>
                <p className="text-secondary">Choose the sector your startup will target</p>
              </div>
            </div>

            <div className="industry-grid">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind.id}
                  className={`industry-card ${selectedIndustry?.id === ind.id ? 'selected' : ''}`}
                  onClick={() => setSelectedIndustry(ind)}
                >
                  <span className="industry-icon">{ind.icon}</span>
                  <span className="industry-name">{ind.name}</span>
                  <span className="industry-desc">{ind.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Idea Input */}
          <div className="card">
            <div className="section-header">
              <div className="icon">💡</div>
              <div>
                <h3>Describe Your Startup Idea</h3>
                <p className="text-secondary">Be specific about the problem you want to solve</p>
              </div>
            </div>

            <textarea
              className="input"
              rows="4"
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder={selectedIndustry
                ? `e.g., A ${selectedIndustry.name} solution that helps users...`
                : "First select an industry above, then describe your idea..."
              }
              disabled={!selectedIndustry}
            />

            <div className="flex justify-between items-center mt-4">
              <div className="selected-industry-badge">
                {selectedIndustry ? (
                  <>
                    <span>{selectedIndustry.icon}</span>
                    <span>Targeting: <strong>{selectedIndustry.name}</strong></span>
                  </>
                ) : (
                  <span className="text-muted">No industry selected</span>
                )}
              </div>
              <button
                className="button large"
                onClick={generateIdeas}
                disabled={loading || !ideaText.trim() || !selectedIndustry}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 20, height: 20 }}></span>
                    Generating Ideas...
                  </>
                ) : (
                  "Generate AI Ideas →"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Select Refined Idea */}
      {step === 2 && (
        <div className="step-content">
          <div className="step-header">
            <div>
              <h2>Select Your Best Idea</h2>
              <p className="text-secondary">
                AI generated {ideas.length} refined concepts for <strong>{selectedIndustry?.name}</strong>.
                Choose one to analyze.
              </p>
            </div>
            <button className="button secondary" onClick={() => setStep(1)}>
              ← Back
            </button>
          </div>

          <div className="grid three">
            {ideas.map((idea, idx) => (
              <IdeaCard
                key={idx}
                idea={idea}
                index={idx}
                onSelect={() => selectIdea(idea)}
                selected={selectedIdea === idea}
              />
            ))}
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="spinner large"></div>
              <p>Analyzing your idea across all dimensions...</p>
              <p className="text-muted">This may take 10-20 seconds</p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: View Insights */}
      {step === 3 && insights && (
        <div className="step-content">
          <div className="step-header">
            <div>
              <span className="badge blue">{selectedIndustry?.icon} {selectedIndustry?.name}</span>
              <h2>{selectedIdea?.name}</h2>
              <p className="text-secondary">{selectedIdea?.value_proposition}</p>
            </div>
            <button className="button secondary" onClick={resetFlow}>
              Start New Analysis
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            {[
              { id: "market", label: "📊 Market", icon: "📊" },
              { id: "competitors", label: "🏆 Competitors", icon: "🏆" },
              { id: "risks", label: "⚡ Risks & Opportunities", icon: "⚡" },
              { id: "scores", label: "📈 Validation", icon: "📈" },
              { id: "partners", label: "🤝 Partners", icon: "🤝" },
            ].map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "market" && <MarketInsights insight={insights.market} industry={selectedIndustry} />}
            {activeTab === "competitors" && <CompetitorPanel snapshot={insights.competitors} />}
            {activeTab === "risks" && <RiskAssessment assessment={insights.risks} />}
            {activeTab === "scores" && <ValidationScore scores={insights.scores} idea={selectedIdea} />}
            {activeTab === "partners" && <PartnerSuggestions partners={insights.partners} industry={selectedIndustry} />}
          </div>
        </div>
      )}

      <style>{`
        .dashboard {
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .steps-container {
          margin-bottom: 32px;
        }
        
        .step-content {
          animation: fadeIn 0.4s ease;
        }
        
        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .section-header {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .section-header .icon {
          width: 48px;
          height: 48px;
          background: var(--gradient-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        /* Error Banner */
        .error-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          border-radius: 12px;
          margin-bottom: 24px;
          color: #ef4444;
        }
        
        .error-banner button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
        }
        
        /* Industry Grid */
        .industry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        
        .industry-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 12px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        
        .industry-card:hover {
          border-color: var(--neon-purple);
          transform: translateY(-2px);
        }
        
        .industry-card.selected {
          border-color: var(--neon-blue);
          background: rgba(0, 212, 255, 0.1);
          box-shadow: var(--glow-blue);
        }
        
        .industry-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        
        .industry-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        
        .industry-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        
        .selected-industry-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          font-size: 0.9rem;
        }
        
        /* Tabs */
        .tabs-container {
          display: flex;
          gap: 8px;
          padding: 8px;
          background: var(--bg-tertiary);
          border-radius: 12px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        
        .tab-button {
          flex: 1;
          padding: 12px 20px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .tab-button:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
        }
        
        .tab-button.active {
          background: var(--gradient-primary);
          color: white;
        }
        
        .tab-content {
          animation: fadeIn 0.3s ease;
        }
        
        .loading-overlay {
          text-align: center;
          padding: 60px 20px;
        }
        
        .loading-overlay .spinner.large {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
