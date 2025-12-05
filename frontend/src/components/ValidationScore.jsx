export default function ValidationScore({ scores, idea }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--neon-green)';
    if (score >= 60) return 'var(--neon-blue)';
    if (score >= 40) return 'var(--neon-orange)';
    return 'var(--neon-pink)';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Needs Work';
  };

  const getReadinessData = (level) => {
    const data = {
      'High': { color: 'green', icon: '🚀', desc: 'The market is primed for your solution. Strong demand signals and minimal education needed.' },
      'Medium': { color: 'orange', icon: '⚡', desc: 'Growing market awareness. Good timing to enter with proper positioning strategy.' },
      'Low': { color: 'pink', icon: '🌱', desc: 'Early stage market requiring customer education and awareness building.' }
    };
    return data[level] || data['Medium'];
  };

  const readiness = getReadinessData(scores.market_readiness);

  return (
    <div className="validation-score-enhanced">
      {/* NLP Badge */}
      <div className="nlp-badge">
        <span className="nlp-icon">📊</span>
        <span>Algorithmic Validation</span>
        <span className="accuracy">Based on 40+ data points</span>
      </div>

      {/* Overall Score Hero */}
      <div className="overall-hero">
        <div className="hero-score-circle">
          <svg viewBox="0 0 120 120">
            <circle className="bg-ring" cx="60" cy="60" r="52" />
            <circle
              className="score-ring"
              cx="60" cy="60" r="52"
              style={{
                stroke: getScoreColor(Math.round((scores.feasibility_score + scores.novelty_score) / 2)),
                strokeDasharray: `${((scores.feasibility_score + scores.novelty_score) / 2) * 3.27} 327`
              }}
            />
          </svg>
          <div className="hero-score-value">
            <span className="value">{Math.round((scores.feasibility_score + scores.novelty_score) / 2)}</span>
            <span className="label">Overall</span>
          </div>
        </div>
        <div className="hero-info">
          <h3>Validation Summary</h3>
          <p className="hero-desc">
            Your startup idea "<strong>{idea?.name || 'Startup'}</strong>" scores
            <strong style={{ color: getScoreColor(Math.round((scores.feasibility_score + scores.novelty_score) / 2)) }}>
              {' '}{getScoreLabel(Math.round((scores.feasibility_score + scores.novelty_score) / 2))}
            </strong> overall.
            The analysis evaluates feasibility, market novelty, and readiness based on competitive landscape and market trends.
          </p>
        </div>
      </div>

      {/* Detailed Scores Grid */}
      <div className="scores-detail-grid">
        {/* Feasibility Score */}
        <div className="score-detail-card">
          <div className="score-visual">
            <svg viewBox="0 0 100 100">
              <circle className="bg-ring" cx="50" cy="50" r="42" />
              <circle
                className="score-ring"
                cx="50" cy="50" r="42"
                style={{
                  stroke: getScoreColor(scores.feasibility_score),
                  strokeDasharray: `${scores.feasibility_score * 2.64} 264`
                }}
              />
            </svg>
            <div className="score-center">
              <span className="score-num">{scores.feasibility_score}</span>
              <span className="score-max">/100</span>
            </div>
          </div>
          <div className="score-info">
            <h4>Feasibility Score</h4>
            <span className={`score-badge ${scores.feasibility_score >= 70 ? 'success' : scores.feasibility_score >= 50 ? 'warning' : 'danger'}`}>
              {getScoreLabel(scores.feasibility_score)}
            </span>
            <p className="score-reasoning">
              {scores.feasibility_score >= 70
                ? "Your idea is highly achievable with current technology and resources. Low barriers to entry and clear implementation path."
                : scores.feasibility_score >= 50
                  ? "Achievable with moderate effort. Some technical or resource challenges to address during development."
                  : "Significant challenges identified. Consider simplifying scope or securing additional resources before launch."}
            </p>
            <div className="score-factors">
              <span className="factor">📦 Technical Complexity</span>
              <span className="factor">💰 Resource Requirements</span>
              <span className="factor">⏱️ Time to Market</span>
            </div>
          </div>
        </div>

        {/* Novelty Score */}
        <div className="score-detail-card">
          <div className="score-visual">
            <svg viewBox="0 0 100 100">
              <circle className="bg-ring" cx="50" cy="50" r="42" />
              <circle
                className="score-ring"
                cx="50" cy="50" r="42"
                style={{
                  stroke: getScoreColor(scores.novelty_score),
                  strokeDasharray: `${scores.novelty_score * 2.64} 264`
                }}
              />
            </svg>
            <div className="score-center">
              <span className="score-num">{scores.novelty_score}</span>
              <span className="score-max">/100</span>
            </div>
          </div>
          <div className="score-info">
            <h4>Novelty Score</h4>
            <span className={`score-badge ${scores.novelty_score >= 70 ? 'success' : scores.novelty_score >= 50 ? 'warning' : 'danger'}`}>
              {getScoreLabel(scores.novelty_score)}
            </span>
            <p className="score-reasoning">
              {scores.novelty_score >= 70
                ? "Highly differentiated from competitors. Strong unique value proposition that stands out in the market."
                : scores.novelty_score >= 50
                  ? "Some differentiation from existing solutions. Consider strengthening unique features to stand out."
                  : "Similar solutions exist. Focus on finding a unique angle or underserved niche to improve positioning."}
            </p>
            <div className="score-factors">
              <span className="factor">🎯 Uniqueness</span>
              <span className="factor">🏆 Competitive Edge</span>
              <span className="factor">💎 Value Proposition</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Readiness - Full Width */}
      <div className={`readiness-card ${readiness.color}`}>
        <div className="readiness-header">
          <div className="readiness-icon">{readiness.icon}</div>
          <div>
            <span className="readiness-label">Market Readiness</span>
            <h3 className="readiness-level">{scores.market_readiness}</h3>
          </div>
        </div>
        <p className="readiness-desc">{readiness.desc}</p>
        <div className="readiness-indicators">
          <div className="indicator">
            <span className="ind-label">Market Awareness</span>
            <div className="ind-bar">
              <div className="ind-fill" style={{ width: scores.market_readiness === 'High' ? '90%' : scores.market_readiness === 'Medium' ? '60%' : '30%' }}></div>
            </div>
          </div>
          <div className="indicator">
            <span className="ind-label">Customer Demand</span>
            <div className="ind-bar">
              <div className="ind-fill" style={{ width: scores.market_readiness === 'High' ? '85%' : scores.market_readiness === 'Medium' ? '55%' : '25%' }}></div>
            </div>
          </div>
          <div className="indicator">
            <span className="ind-label">Purchase Intent</span>
            <div className="ind-bar">
              <div className="ind-fill" style={{ width: scores.market_readiness === 'High' ? '80%' : scores.market_readiness === 'Medium' ? '50%' : '20%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .validation-score-enhanced {
          animation: fadeIn 0.4s ease;
        }
        
        /* NLP Badge */
        .nlp-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 212, 255, 0.1));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 100px;
          margin-bottom: 24px;
          font-size: 0.85rem;
        }
        
        .nlp-icon { font-size: 1.1rem; }
        
        .accuracy {
          padding: 4px 10px;
          background: rgba(168, 85, 247, 0.2);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--neon-purple);
        }
        
        /* Overall Hero */
        .overall-hero {
          display: flex;
          gap: 32px;
          align-items: center;
          padding: 32px;
          background: linear-gradient(135deg, var(--bg-tertiary), rgba(168, 85, 247, 0.1));
          border: 2px solid rgba(168, 85, 247, 0.3);
          border-radius: 20px;
          margin-bottom: 32px;
        }
        
        .hero-score-circle {
          position: relative;
          width: 140px;
          height: 140px;
          flex-shrink: 0;
        }
        
        .hero-score-circle svg {
          transform: rotate(-90deg);
        }
        
        .bg-ring {
          fill: none;
          stroke: var(--bg-secondary);
          stroke-width: 8;
        }
        
        .score-ring {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dasharray 1s ease;
        }
        
        .hero-score-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        
        .hero-score-value .value {
          font-size: 2.5rem;
          font-weight: 700;
          display: block;
        }
        
        .hero-score-value .label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        
        .hero-info h3 {
          margin: 0 0 12px;
          font-size: 1.4rem;
        }
        
        .hero-desc {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.6;
          margin: 0;
        }
        
        /* Scores Grid */
        .scores-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        
        .score-detail-card {
          display: flex;
          gap: 24px;
          padding: 28px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }
        
        .score-visual {
          position: relative;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
        }
        
        .score-visual svg {
          transform: rotate(-90deg);
        }
        
        .score-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        
        .score-num {
          font-size: 1.8rem;
          font-weight: 700;
          display: block;
        }
        
        .score-max {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .score-info h4 {
          margin: 0 0 8px;
        }
        
        .score-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        .score-badge.success {
          background: rgba(16, 185, 129, 0.2);
          color: var(--neon-green);
        }
        
        .score-badge.warning {
          background: rgba(249, 115, 22, 0.2);
          color: var(--neon-orange);
        }
        
        .score-badge.danger {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        
        .score-reasoning {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 14px;
        }
        
        .score-factors {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .factor {
          padding: 4px 10px;
          background: var(--bg-secondary);
          border-radius: 100px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        /* Readiness Card */
        .readiness-card {
          padding: 28px;
          border-radius: 16px;
          border: 2px solid;
        }
        
        .readiness-card.green {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), transparent);
          border-color: rgba(16, 185, 129, 0.4);
        }
        
        .readiness-card.orange {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), transparent);
          border-color: rgba(249, 115, 22, 0.4);
        }
        
        .readiness-card.pink {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), transparent);
          border-color: rgba(236, 72, 153, 0.4);
        }
        
        .readiness-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .readiness-icon {
          font-size: 2.5rem;
        }
        
        .readiness-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
        }
        
        .readiness-level {
          margin: 4px 0 0;
          font-size: 1.5rem;
        }
        
        .readiness-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        
        .readiness-indicators {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        
        .indicator {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .ind-label {
          width: 140px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        
        .ind-bar {
          flex: 1;
          height: 10px;
          background: var(--bg-secondary);
          border-radius: 5px;
          overflow: hidden;
        }
        
        .ind-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 5px;
          transition: width 1s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
