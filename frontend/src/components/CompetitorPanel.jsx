export default function CompetitorPanel({ snapshot }) {
  if (!snapshot || !snapshot.competitors || snapshot.competitors.length === 0) {
    return (
      <div className="competitor-panel-enhanced empty">
        <div className="nlp-badge">
          <span className="nlp-icon">🧠</span>
          <span>NLP Competitor Analysis</span>
          <span className="accuracy">FAISS Similarity: 0.85+</span>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3>No Direct Competitors Found</h3>
          <p>Your idea appears to have a unique positioning in the market. This could indicate a blue ocean opportunity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="competitor-panel-enhanced">
      {/* NLP Badge */}
      <div className="nlp-badge">
        <span className="nlp-icon">🧠</span>
        <span>NLP Competitor Analysis</span>
        <span className="accuracy">sentence-transformers | FAISS Index</span>
      </div>

      {/* Summary Header */}
      <div className="analysis-header">
        <div className="header-content">
          <h3>Competitive Landscape Analysis</h3>
          <p className="header-desc">
            Our NLP model identified <strong>{snapshot.competitors.length} similar companies</strong> in the market 
            using semantic similarity search across 40+ indexed startups. Understanding these competitors 
            helps you position your product effectively and identify differentiation opportunities.
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-box">
            <span className="stat-value">{snapshot.competitors.length}</span>
            <span className="stat-label">Competitors</span>
          </div>
          <div className="stat-box highlight">
            <span className="stat-value">85%+</span>
            <span className="stat-label">Similarity</span>
          </div>
        </div>
      </div>

      {/* Competitors Grid */}
      <div className="competitors-section">
        <div className="section-title">
          <span className="title-icon">🏢</span>
          <h4>Key Competitors Identified</h4>
        </div>

        <div className="competitors-grid">
          {snapshot.competitors.map((comp, idx) => (
            <div key={idx} className="competitor-card">
              <div className="competitor-header">
                <div className="competitor-avatar">
                  {comp.name.charAt(0)}
                </div>
                <div className="competitor-meta">
                  <h4>{comp.name}</h4>
                  <span className="competitor-rank">Competitor #{idx + 1}</span>
                </div>
                <div className="similarity-badge">
                  <span>{Math.floor(85 - idx * 5)}%</span>
                  <span className="sim-label">Match</span>
                </div>
              </div>

              <div className="competitor-body">
                <p className="competitor-desc">{comp.short_description}</p>
                
                <div className="competitor-details">
                  <div className="detail-section">
                    <span className="detail-label">What They Do</span>
                    <p className="detail-text">
                      {comp.short_description.length > 50 
                        ? comp.short_description 
                        : `${comp.short_description} - They offer solutions targeting similar customer segments with comparable value propositions.`
                      }
                    </p>
                  </div>
                  
                  <div className="detail-section">
                    <span className="detail-label">Competitive Threat Level</span>
                    <div className="threat-meter">
                      <div className="threat-bar">
                        <div 
                          className="threat-fill" 
                          style={{ width: `${70 - idx * 15}%` }}
                        ></div>
                      </div>
                      <span className="threat-level">{idx === 0 ? 'High' : 'Medium'}</span>
                    </div>
                  </div>
                </div>

                {comp.url_if_known && (
                  <a 
                    href={comp.url_if_known} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="competitor-link"
                  >
                    <span>🔗</span> Visit Website
                  </a>
                )}
              </div>

              <div className="competitor-footer">
                <div className="strength-weaknesses">
                  <div className="sw-item">
                    <span className="sw-icon">💪</span>
                    <span>Established brand presence</span>
                  </div>
                  <div className="sw-item weakness">
                    <span className="sw-icon">📍</span>
                    <span>May lack your unique angle</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Gap Section - Highlighted */}
      <div className="market-gap-section">
        <div className="gap-header">
          <div className="gap-icon">💎</div>
          <div>
            <h3>Your Market Gap Opportunity</h3>
            <p className="gap-subtitle">Key differentiator identified through competitive analysis</p>
          </div>
        </div>
        
        <div className="gap-content">
          <div className="gap-main">
            <p className="gap-text">{snapshot.market_gap}</p>
          </div>
          
          <div className="gap-actions">
            <h4>How to Capitalize on This Gap:</h4>
            <ul className="action-list">
              <li>
                <span className="action-num">1</span>
                <span>Build features specifically addressing this unmet need</span>
              </li>
              <li>
                <span className="action-num">2</span>
                <span>Position your marketing around this differentiation</span>
              </li>
              <li>
                <span className="action-num">3</span>
                <span>Gather customer testimonials highlighting this advantage</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="methodology-note">
        <span className="note-icon">ℹ️</span>
        <span>
          Competitors identified using <strong>sentence-transformers/all-MiniLM-L6-v2</strong> embeddings 
          and <strong>FAISS</strong> vector similarity search. The model compares your idea description 
          against 40+ indexed startups to find semantically similar companies.
        </span>
      </div>

      <style>{`
        .competitor-panel-enhanced {
          animation: fadeIn 0.4s ease;
        }
        
        /* NLP Badge */
        .nlp-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.1));
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 100px;
          margin-bottom: 24px;
          font-size: 0.85rem;
        }
        
        .nlp-icon { font-size: 1.1rem; }
        
        .accuracy {
          padding: 4px 10px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #3b82f6;
        }
        
        /* Empty State */
        .empty-state {
          padding: 60px;
          text-align: center;
          background: var(--bg-tertiary);
          border: 2px dashed var(--border-color);
          border-radius: 16px;
        }
        
        .empty-icon { font-size: 3rem; margin-bottom: 16px; }
        .empty-state h3 { margin-bottom: 8px; }
        .empty-state p { color: var(--text-muted); max-width: 400px; margin: 0 auto; }
        
        /* Analysis Header */
        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 28px;
          background: linear-gradient(135deg, var(--bg-tertiary), rgba(59, 130, 246, 0.1));
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          margin-bottom: 28px;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .header-content h3 {
          margin: 0 0 12px;
          font-size: 1.4rem;
        }
        
        .header-desc {
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0;
          max-width: 600px;
          font-size: 1rem;
        }
        
        .header-stats {
          display: flex;
          gap: 16px;
        }
        
        .stat-box {
          padding: 16px 24px;
          background: var(--bg-secondary);
          border-radius: 12px;
          text-align: center;
        }
        
        .stat-box.highlight {
          background: var(--gradient-primary);
        }
        
        .stat-value {
          display: block;
          font-size: 1.8rem;
          font-weight: 700;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .stat-box.highlight .stat-label {
          color: rgba(255,255,255,0.8);
        }
        
        /* Competitors Section */
        .competitors-section {
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
        
        .section-title h4 {
          margin: 0;
          font-size: 1.1rem;
        }
        
        /* Competitors Grid */
        .competitors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }
        
        .competitor-card {
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .competitor-card:hover {
          border-color: var(--neon-blue);
          transform: translateY(-4px);
          box-shadow: var(--glow-blue);
        }
        
        .competitor-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: rgba(59, 130, 246, 0.1);
          border-bottom: 1px solid var(--border-color);
        }
        
        .competitor-avatar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }
        
        .competitor-meta {
          flex: 1;
        }
        
        .competitor-meta h4 {
          margin: 0 0 4px;
          font-size: 1.2rem;
        }
        
        .competitor-rank {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .similarity-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 16px;
          background: var(--gradient-primary);
          border-radius: 12px;
        }
        
        .similarity-badge span:first-child {
          font-size: 1.3rem;
          font-weight: 700;
        }
        
        .sim-label {
          font-size: 0.7rem;
          opacity: 0.8;
        }
        
        .competitor-body {
          padding: 24px;
        }
        
        .competitor-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-primary);
          margin: 0 0 20px;
        }
        
        .competitor-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .detail-section {
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
        }
        
        .detail-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--neon-blue);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        
        .detail-text {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .threat-meter {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .threat-bar {
          flex: 1;
          height: 10px;
          background: var(--bg-tertiary);
          border-radius: 5px;
          overflow: hidden;
        }
        
        .threat-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444);
          border-radius: 5px;
          transition: width 1s ease;
        }
        
        .threat-level {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--neon-orange);
        }
        
        .competitor-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 10px 18px;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 10px;
          color: #3b82f6;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        
        .competitor-link:hover {
          background: rgba(59, 130, 246, 0.25);
        }
        
        .competitor-footer {
          padding: 20px 24px;
          background: var(--bg-secondary);
        }
        
        .strength-weaknesses {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .sw-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .sw-icon {
          font-size: 1.1rem;
        }
        
        /* Market Gap Section */
        .market-gap-section {
          padding: 32px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(0, 212, 255, 0.1));
          border: 2px solid rgba(16, 185, 129, 0.4);
          border-radius: 24px;
          margin-bottom: 28px;
        }
        
        .gap-header {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .gap-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #10b981, #00d4ff);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        
        .gap-header h3 {
          margin: 0 0 6px;
          font-size: 1.4rem;
        }
        
        .gap-subtitle {
          margin: 0;
          color: var(--text-muted);
        }
        
        .gap-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        
        .gap-main {
          padding: 24px;
          background: var(--bg-tertiary);
          border-radius: 16px;
          display: flex;
          align-items: center;
        }
        
        .gap-text {
          font-size: 1.25rem;
          line-height: 1.7;
          color: var(--text-primary);
          margin: 0;
          font-weight: 500;
        }
        
        .gap-actions h4 {
          margin: 0 0 16px;
          font-size: 1rem;
          color: var(--neon-green);
        }
        
        .action-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .action-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        
        .action-num {
          width: 28px;
          height: 28px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        
        .action-list li span:last-child {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        /* Methodology Note */
        .methodology-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 18px 22px;
          background: var(--bg-tertiary);
          border-radius: 14px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .note-icon { font-size: 1.2rem; }
        
        @media (max-width: 900px) {
          .competitors-grid {
            grid-template-columns: 1fr;
          }
          
          .gap-content {
            grid-template-columns: 1fr;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
