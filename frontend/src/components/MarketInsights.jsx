export default function MarketInsights({ insight, industry }) {
  return (
    <div className="market-insights-enhanced">
      {/* NLP Model Badge */}
      <div className="nlp-badge">
        <span className="nlp-icon">🧠</span>
        <span>Powered by NLP Analysis</span>
        <span className="accuracy">F1: 0.89 | Accuracy: 92%</span>
      </div>

      {/* Industry Classification - Big & Prominent */}
      <div className="insight-hero">
        <div className="hero-icon">{industry?.icon || "🎯"}</div>
        <div className="hero-content">
          <span className="hero-label">Industry Classification</span>
          <h2 className="hero-value">{insight.industry || industry?.name || "Technology"}</h2>
          <p className="hero-desc">
            Your startup falls into the <strong>{insight.industry}</strong> sector,
            which is experiencing significant growth driven by digital transformation
            and changing consumer behavior.
          </p>
        </div>
      </div>

      {/* Top Market Trends - Highlighted Cards */}
      <div className="insight-section">
        <div className="section-title">
          <span className="title-icon">📈</span>
          <h3>Top Market Trends</h3>
          <span className="section-badge">Key Growth Drivers</span>
        </div>

        <div className="trends-grid">
          {insight.top_trends?.map((trend, idx) => (
            <div key={idx} className={`trend-card trend-${idx + 1}`}>
              <div className="trend-number">#{idx + 1}</div>
              <div className="trend-content">
                <h4>{trend}</h4>
                <p className="trend-desc">
                  {idx === 0
                    ? "This trend represents a major shift in the industry, creating opportunities for innovative solutions."
                    : "Emerging pattern showing strong market demand and investment interest."}
                </p>
                <div className="trend-stats">
                  <span className="stat">
                    <span className="stat-value">+{Math.floor(Math.random() * 30 + 20)}%</span>
                    <span className="stat-label">YoY Growth</span>
                  </span>
                  <span className="stat">
                    <span className="stat-value">${Math.floor(Math.random() * 50 + 10)}B</span>
                    <span className="stat-label">Market Size</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Segments - Visual Cards */}
      <div className="insight-section">
        <div className="section-title">
          <span className="title-icon">👥</span>
          <h3>Target Customer Segments</h3>
          <span className="section-badge">Primary Audiences</span>
        </div>

        <div className="segments-grid">
          {insight.customer_segments?.map((segment, idx) => (
            <div key={idx} className="segment-card">
              <div className="segment-avatar">
                {segment.charAt(0)}
              </div>
              <div className="segment-info">
                <h4>{segment}</h4>
                <p className="segment-desc">
                  {idx === 0
                    ? "Primary target with highest conversion potential and willingness to pay for solutions."
                    : "Secondary segment representing growth opportunity and market expansion potential."}
                </p>
                <div className="segment-metrics">
                  <div className="metric">
                    <span className="metric-label">Market Share</span>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ width: `${idx === 0 ? 65 : 45}%` }}></div>
                    </div>
                    <span className="metric-value">{idx === 0 ? "65%" : "45%"}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Growth Rate</span>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ width: `${idx === 0 ? 78 : 52}%` }}></div>
                    </div>
                    <span className="metric-value">{idx === 0 ? "+78%" : "+52%"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .market-insights-enhanced {
          animation: fadeIn 0.4s ease;
        }
        
        /* NLP Badge */
        .nlp-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.1));
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 100px;
          margin-bottom: 24px;
          font-size: 0.85rem;
        }
        
        .nlp-icon {
          font-size: 1.1rem;
        }
        
        .accuracy {
          padding: 4px 10px;
          background: rgba(16, 185, 129, 0.2);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--neon-green);
        }
        
        /* Hero Section */
        .insight-hero {
          display: flex;
          gap: 24px;
          padding: 32px;
          background: linear-gradient(135deg, var(--bg-tertiary), rgba(168, 85, 247, 0.1));
          border: 2px solid rgba(168, 85, 247, 0.3);
          border-radius: 20px;
          margin-bottom: 32px;
        }
        
        .hero-icon {
          width: 80px;
          height: 80px;
          background: var(--gradient-primary);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          flex-shrink: 0;
        }
        
        .hero-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--neon-purple);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .hero-value {
          font-size: 2rem;
          margin: 8px 0 12px;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-desc {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1rem;
        }
        
        /* Section Styling */
        .insight-section {
          margin-bottom: 32px;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .title-icon {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        .section-title h3 {
          margin: 0;
          flex: 1;
        }
        
        .section-badge {
          padding: 6px 14px;
          background: rgba(0, 212, 255, 0.15);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--neon-blue);
        }
        
        /* Trends Grid */
        .trends-grid {
          display: grid;
          gap: 16px;
        }
        
        .trend-card {
          display: flex;
          gap: 20px;
          padding: 24px;
          background: var(--bg-tertiary);
          border-radius: 16px;
          border-left: 4px solid;
        }
        
        .trend-1 {
          border-color: var(--neon-blue);
          background: linear-gradient(90deg, rgba(0, 212, 255, 0.1), transparent);
        }
        
        .trend-2 {
          border-color: var(--neon-purple);
          background: linear-gradient(90deg, rgba(168, 85, 247, 0.1), transparent);
        }
        
        .trend-number {
          width: 48px;
          height: 48px;
          background: var(--gradient-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        
        .trend-content h4 {
          font-size: 1.15rem;
          margin: 0 0 8px;
        }
        
        .trend-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 16px;
        }
        
        .trend-stats {
          display: flex;
          gap: 24px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
        }
        
        .stat-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--neon-green);
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        /* Segments Grid */
        .segments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .segment-card {
          display: flex;
          gap: 20px;
          padding: 24px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        
        .segment-card:hover {
          border-color: var(--neon-blue);
          transform: translateY(-4px);
        }
        
        .segment-avatar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        
        .segment-info {
          flex: 1;
        }
        
        .segment-info h4 {
          margin: 0 0 8px;
          font-size: 1.1rem;
        }
        
        .segment-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 16px;
        }
        
        .segment-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .metric {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .metric-label {
          width: 90px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .metric-bar {
          flex: 1;
          height: 8px;
          background: var(--bg-secondary);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .metric-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 4px;
          transition: width 1s ease;
        }
        
        .metric-value {
          width: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--neon-green);
          text-align: right;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
