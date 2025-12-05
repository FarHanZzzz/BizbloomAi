import { useState } from "react";
import { api } from "../services/api";
import IdeaCard from "../components/IdeaCard";
import MarketInsights from "../components/MarketInsights";
import CompetitorPanel from "../components/CompetitorPanel";
import ValidationScore from "../components/ValidationScore";
import RiskAssessment from "../components/RiskAssessment";
import PartnerSuggestions from "../components/PartnerSuggestions";

export default function Portfolio() {
  const [ideaText, setIdeaText] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("idea");

  const build = async () => {
    if (!ideaText.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/portfolio/build", { idea: ideaText });
      setPortfolio(data);
      setActiveSection("idea");
    } catch (err) {
      console.error("Build failed:", err);
    }
    setLoading(false);
  };

  const sections = [
    { id: "idea", label: "💡 Idea", icon: "💡" },
    { id: "market", label: "📊 Market", icon: "📊" },
    { id: "competitors", label: "🏆 Competitors", icon: "🏆" },
    { id: "risks", label: "⚡ Risks", icon: "⚡" },
    { id: "scores", label: "📈 Scores", icon: "📈" },
    { id: "partners", label: "🤝 Partners", icon: "🤝" },
  ];

  return (
    <div className="portfolio-page">
      {/* Header */}
      <div className="portfolio-header">
        <div className="header-content">
          <h1>
            <span className="gradient-text">Business Portfolio</span>
          </h1>
          <p className="text-secondary">
            Generate a complete validated portfolio from your idea. Includes market analysis, 
            competitor research, risk assessment, and partner suggestions.
          </p>
        </div>
      </div>

      {/* Input Section */}
      {!portfolio && (
        <div className="card input-section">
          <div className="section-header">
            <div className="icon">🚀</div>
            <div>
              <h3>Describe Your Startup Idea</h3>
              <p className="text-secondary">Be specific about the problem and your solution</p>
            </div>
          </div>
          
          <textarea
            className="input"
            rows="5"
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="e.g., A platform connecting local farmers with restaurants to sell fresh produce directly, reducing costs and ensuring fresher ingredients for chefs..."
          />
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              ✨ We'll analyze market, competitors, risks & find partners
            </span>
            <button 
              className="button large" 
              onClick={build} 
              disabled={loading || !ideaText.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20 }}></span>
                  Building Portfolio...
                </>
              ) : (
                "Build Complete Portfolio →"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-content">
            <div className="spinner large"></div>
            <h3>Building Your Portfolio...</h3>
            <p className="text-secondary">
              Analyzing market, researching competitors, assessing risks...
            </p>
            <div className="loading-steps">
              <div className="loading-step active">💡 Refining idea</div>
              <div className="loading-step">📊 Market research</div>
              <div className="loading-step">🏆 Competitor analysis</div>
              <div className="loading-step">⚡ Risk assessment</div>
              <div className="loading-step">🤝 Partner matching</div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Results */}
      {portfolio && !loading && (
        <div className="portfolio-results">
          {/* Portfolio Header */}
          <div className="card portfolio-summary">
            <div className="flex justify-between items-center">
              <div>
                <span className="badge blue">Portfolio #{portfolio.portfolio_id}</span>
                <h2 className="mt-2">{portfolio.data?.idea?.name || "Your Startup"}</h2>
                <p className="text-secondary">{portfolio.data?.idea?.value_proposition}</p>
              </div>
              <div className="flex gap-3">
                {portfolio.pdf_url && (
                  <a href={portfolio.pdf_url} className="button secondary" download>
                    📄 Download PDF
                  </a>
                )}
                <button className="button secondary" onClick={() => setPortfolio(null)}>
                  Start New
                </button>
              </div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="section-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Section Content */}
          <div className="section-content">
            {activeSection === "idea" && portfolio.data?.idea && (
              <IdeaCard idea={portfolio.data.idea} index={0} />
            )}
            
            {activeSection === "market" && portfolio.data?.market && (
              <MarketInsights insight={portfolio.data.market} />
            )}
            
            {activeSection === "competitors" && portfolio.data?.competitors && (
              <CompetitorPanel snapshot={portfolio.data.competitors} />
            )}
            
            {activeSection === "risks" && portfolio.data?.risks && (
              <RiskAssessment assessment={portfolio.data.risks} />
            )}
            
            {activeSection === "scores" && portfolio.data?.scores && (
              <ValidationScore scores={portfolio.data.scores} />
            )}
            
            {activeSection === "partners" && (
              <PartnerSuggestions partners={portfolio.data?.partners || []} />
            )}
          </div>
        </div>
      )}

      <style>{`
        .portfolio-page {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .portfolio-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .portfolio-header h1 {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }
        
        .portfolio-header p {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .input-section {
          padding: 32px;
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
        }
        
        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }
        
        .spinner.large {
          width: 60px;
          height: 60px;
          margin: 0 auto 24px;
        }
        
        .loading-steps {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
        }
        
        .loading-step {
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border-radius: 20px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .loading-step.active {
          background: var(--gradient-primary);
          color: white;
        }
        
        .portfolio-results {
          animation: fadeIn 0.4s ease;
        }
        
        .portfolio-summary {
          padding: 28px;
          margin-bottom: 24px;
        }
        
        .portfolio-summary h2 {
          margin-bottom: 8px;
        }
        
        .section-nav {
          display: flex;
          gap: 8px;
          padding: 8px;
          background: var(--bg-tertiary);
          border-radius: 16px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        
        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-secondary);
          min-width: 80px;
        }
        
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
        
        .nav-item.active {
          background: var(--gradient-primary);
          color: white;
        }
        
        .nav-icon {
          font-size: 1.25rem;
        }
        
        .nav-label {
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .section-content {
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
