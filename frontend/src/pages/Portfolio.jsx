import { useState } from "react";
import { api } from "../services/api";
import IdeaCard from "../components/IdeaCard";

export default function Portfolio() {
  const [ideaText, setIdeaText] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);

  const build = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/portfolio/build", { idea: ideaText });
      setPortfolio(data);
    } catch (err) {
      console.error("Build failed:", err);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3>Build Business Portfolio</h3>
      <p style={{ color: "#64748b", marginBottom: 16 }}>
        Enter your startup idea and we'll generate a complete validated portfolio with market insights, competitor analysis, risk assessment, and partner suggestions.
      </p>
      <textarea 
        className="input" 
        rows="4" 
        value={ideaText} 
        onChange={(e) => setIdeaText(e.target.value)} 
        placeholder="e.g., A platform connecting local farmers with restaurants to sell fresh produce directly..."
      />
      <br />
      <button className="button" onClick={build} disabled={loading || !ideaText.trim()}>
        {loading ? "Building..." : "Build Portfolio"}
      </button>
      
      {portfolio && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>📋 Portfolio: {portfolio.portfolio_id}</h3>
            {portfolio.pdf_url && (
              <a href={portfolio.pdf_url} className="button" style={{ fontSize: 12 }}>
                Download PDF
              </a>
            )}
          </div>
          
          {/* Idea Section */}
          <IdeaCard idea={portfolio.data.idea} />
          
          {/* Market Overview */}
          {portfolio.data.market && (
            <div className="card" style={{ marginTop: 16, background: "#f8fafc" }}>
              <h4>📊 Market Overview</h4>
              <p><strong>Industry:</strong> {portfolio.data.market.industry}</p>
              <p><strong>Top Trends:</strong> {portfolio.data.market.top_trends?.join(", ")}</p>
              <p><strong>Customer Segments:</strong> {portfolio.data.market.customer_segments?.join(", ")}</p>
            </div>
          )}
          
          {/* Competitors */}
          {portfolio.data.competitors && (
            <div className="card" style={{ marginTop: 16, background: "#fef3c7" }}>
              <h4>🏆 Competitor Snapshot</h4>
              <ul>
                {portfolio.data.competitors.competitors?.map((c, i) => (
                  <li key={i}><strong>{c.name}</strong>: {c.short_description}</li>
                ))}
              </ul>
              <p><strong>Market Gap:</strong> {portfolio.data.competitors.market_gap}</p>
            </div>
          )}
          
          {/* Risks & Opportunities */}
          {portfolio.data.risks && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <div className="card" style={{ background: "#dcfce7" }}>
                <h4>✅ Opportunities</h4>
                <ul>
                  {portfolio.data.risks.opportunities?.map((o, i) => <li key={i}>{o}</li>)}
                </ul>
              </div>
              <div className="card" style={{ background: "#fee2e2" }}>
                <h4>⚠️ Risks</h4>
                <ul>
                  {portfolio.data.risks.risks?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                <p><strong>Mitigation:</strong> {portfolio.data.risks.mitigation}</p>
              </div>
            </div>
          )}
          
          {/* Validation Scores */}
          {portfolio.data.scores && (
            <div className="card" style={{ marginTop: 16, background: "#e0e7ff" }}>
              <h4>📈 Validation Scores</h4>
              <div style={{ display: "flex", gap: 24 }}>
                <div>
                  <strong>Feasibility:</strong> {portfolio.data.scores.feasibility_score}/100
                </div>
                <div>
                  <strong>Novelty:</strong> {portfolio.data.scores.novelty_score}/100
                </div>
                <div>
                  <strong>Market Readiness:</strong> {portfolio.data.scores.market_readiness}
                </div>
              </div>
            </div>
          )}
          
          {/* Partner Suggestions */}
          {portfolio.data.partners?.length > 0 && (
            <div className="card" style={{ marginTop: 16, background: "#fae8ff" }}>
              <h4>🤝 Suggested Partners</h4>
              <ul>
                {portfolio.data.partners.map((p, i) => (
                  <li key={i}>
                    <strong>{p.name}</strong> — Match: {(p.interest_overlap_score * 100).toFixed(0)}% | 
                    Skills: {p.skills?.join(", ")} | Contact: {p.contact_hint}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


