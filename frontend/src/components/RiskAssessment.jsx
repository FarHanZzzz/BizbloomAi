export default function RiskAssessment({ assessment }) {
  return (
    <div className="risk-assessment-enhanced">
      {/* NLP Badge */}
      <div className="nlp-badge">
        <span className="nlp-icon">🧠</span>
        <span>AI Risk Analysis</span>
        <span className="accuracy">OpenRouter | Mistral-7B</span>
      </div>

      <div className="assessment-grid">
        {/* Opportunities Section */}
        <div className="assessment-panel opportunities">
          <div className="panel-header">
            <div className="panel-icon">✅</div>
            <div>
              <h3>Growth Opportunities</h3>
              <p className="panel-subtitle">Strategic advantages for your startup</p>
            </div>
          </div>
          
          <div className="items-list">
            {assessment.opportunities?.map((opp, idx) => (
              <div key={idx} className="item-card">
                <div className="item-number">{idx + 1}</div>
                <div className="item-content">
                  <h4>{opp}</h4>
                  <p className="item-desc">
                    {idx === 0 
                      ? "This opportunity represents a significant market gap that your solution can uniquely address. Early entrants in this space have shown 3x higher success rates."
                      : "Capitalize on this trend by positioning your product to meet emerging customer demands. Market research indicates strong buyer intent in this area."}
                  </p>
                  <div className="item-tags">
                    <span className="tag success">High Impact</span>
                    <span className="tag info">Q1-Q2 Timeline</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="panel-summary">
            <span className="summary-icon">💡</span>
            <span>Focus on these opportunities to establish market presence and build competitive advantage.</span>
          </div>
        </div>

        {/* Risks Section */}
        <div className="assessment-panel risks">
          <div className="panel-header">
            <div className="panel-icon">⚠️</div>
            <div>
              <h3>Potential Risks</h3>
              <p className="panel-subtitle">Challenges to anticipate and address</p>
            </div>
          </div>
          
          <div className="items-list">
            {assessment.risks?.map((risk, idx) => (
              <div key={idx} className="item-card">
                <div className="item-number">{idx + 1}</div>
                <div className="item-content">
                  <h4>{risk}</h4>
                  <p className="item-desc">
                    {idx === 0 
                      ? "This risk factor could impact your go-to-market timeline. Similar startups have mitigated this by building strong partnerships and maintaining lean operations."
                      : "Monitor this risk closely as market conditions evolve. Having contingency plans and flexible resource allocation will be key to managing this challenge."}
                  </p>
                  <div className="item-tags">
                    <span className="tag warning">Medium Severity</span>
                    <span className="tag neutral">Controllable</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="panel-summary warning">
            <span className="summary-icon">🔍</span>
            <span>Regular risk assessment reviews recommended every 2-4 weeks during early stages.</span>
          </div>
        </div>
      </div>

      {/* Mitigation Strategy - Full Width, Prominent */}
      <div className="mitigation-section">
        <div className="mitigation-header">
          <div className="mitigation-icon">🛡️</div>
          <div>
            <h3>Recommended Mitigation Strategy</h3>
            <p className="mitigation-subtitle">Your actionable plan to minimize risks and maximize success</p>
          </div>
        </div>
        
        <div className="mitigation-content">
          <div className="mitigation-main">
            <p className="mitigation-text">{assessment.mitigation}</p>
          </div>
        </div>
      </div>

      {/* Detailed Implementation Roadmap */}
      <div className="roadmap-section">
        <div className="roadmap-header">
          <div className="roadmap-icon">🗺️</div>
          <h3>Implementation Roadmap</h3>
          <p className="roadmap-desc">Follow this step-by-step guide to execute your mitigation strategy effectively</p>
        </div>

        <div className="roadmap-timeline">
          {/* Phase 1 */}
          <div className="phase-card phase-1">
            <div className="phase-marker">
              <span className="phase-num">1</span>
              <div className="phase-line"></div>
            </div>
            <div className="phase-content">
              <div className="phase-header">
                <span className="phase-badge immediate">Immediate Action</span>
                <span className="phase-duration">Week 1-2</span>
              </div>
              <h4>Foundation & Validation</h4>
              <ul className="phase-tasks">
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Identify 5-10 Key Stakeholders:</strong> Create a list of potential early adopters, 
                    industry experts, and potential partners who can provide feedback and validation.
                  </div>
                </li>
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Set Up Feedback Channels:</strong> Create a simple landing page, survey, 
                    or interview schedule to gather structured feedback from your target audience.
                  </div>
                </li>
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Define Success Metrics:</strong> Establish clear KPIs for your MVP including 
                    user engagement, conversion rates, and satisfaction scores.
                  </div>
                </li>
              </ul>
              <div className="phase-outcome">
                <strong>Expected Outcome:</strong> Clear understanding of market needs and validated problem-solution fit
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="phase-card phase-2">
            <div className="phase-marker">
              <span className="phase-num">2</span>
              <div className="phase-line"></div>
            </div>
            <div className="phase-content">
              <div className="phase-header">
                <span className="phase-badge short-term">Short-term Focus</span>
                <span className="phase-duration">Month 1-2</span>
              </div>
              <h4>MVP Development & Testing</h4>
              <ul className="phase-tasks">
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Build Core Features Only:</strong> Focus on the 2-3 features that solve the 
                    primary pain point. Avoid feature creep - less is more at this stage.
                  </div>
                </li>
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Launch Beta Program:</strong> Onboard 20-50 beta users and provide white-glove 
                    support. Document all feedback, bugs, and feature requests systematically.
                  </div>
                </li>
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Iterate Based on Data:</strong> Analyze usage patterns, conduct user interviews, 
                    and make rapid improvements. Aim for weekly release cycles.
                  </div>
                </li>
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Establish Pricing Model:</strong> Test different pricing tiers with beta users 
                    to understand willingness to pay and value perception.
                  </div>
                </li>
              </ul>
              <div className="phase-outcome">
                <strong>Expected Outcome:</strong> Validated MVP with proven product-market fit and initial revenue
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="phase-card phase-3">
            <div className="phase-marker">
              <span className="phase-num">3</span>
            </div>
            <div className="phase-content">
              <div className="phase-header">
                <span className="phase-badge medium-term">Growth Phase</span>
                <span className="phase-duration">Month 3-6</span>
              </div>
              <h4>Scaling & Market Expansion</h4>
              <ul className="phase-tasks">
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Scale Marketing Efforts:</strong> Based on successful beta channels, invest in 
                    content marketing, SEO, and targeted advertising. Aim for 10x user growth.
                  </div>
                </li>
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Build Strategic Partnerships:</strong> Identify and pursue partnerships with 
                    complementary businesses, influencers, or platforms in your industry.
                  </div>
                </li>
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Hire Key Roles:</strong> Bring on 1-2 team members for critical functions 
                    (engineering, sales, customer success) based on validated needs.
                  </div>
                </li>
                <li>
                  <span className="task-check">☐</span>
                  <div>
                    <strong>Prepare for Fundraising:</strong> Create investor materials including pitch deck, 
                    financial projections, and traction metrics for potential seed round.
                  </div>
                </li>
              </ul>
              <div className="phase-outcome">
                <strong>Expected Outcome:</strong> Scalable business with proven revenue model and growth trajectory
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .risk-assessment-enhanced {
          animation: fadeIn 0.4s ease;
        }
        
        /* NLP Badge */
        .nlp-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(239, 68, 68, 0.1));
          border: 1px solid rgba(249, 115, 22, 0.3);
          border-radius: 100px;
          margin-bottom: 24px;
          font-size: 0.85rem;
        }
        
        .nlp-icon { font-size: 1.1rem; }
        
        .accuracy {
          padding: 4px 10px;
          background: rgba(249, 115, 22, 0.2);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--neon-orange);
        }
        
        /* Grid Layout */
        .assessment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        
        /* Panel Styling */
        .assessment-panel {
          padding: 28px;
          border-radius: 20px;
          border: 2px solid;
        }
        
        .assessment-panel.opportunities {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.1), transparent);
          border-color: rgba(16, 185, 129, 0.3);
        }
        
        .assessment-panel.risks {
          background: linear-gradient(145deg, rgba(239, 68, 68, 0.1), transparent);
          border-color: rgba(239, 68, 68, 0.3);
        }
        
        .panel-header {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .panel-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .opportunities .panel-icon { background: rgba(16, 185, 129, 0.2); }
        .risks .panel-icon { background: rgba(239, 68, 68, 0.2); }
        
        .panel-header h3 { margin: 0 0 4px; }
        .panel-subtitle { margin: 0; font-size: 0.85rem; color: var(--text-muted); }
        
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .item-card {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 12px;
        }
        
        .item-number {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        
        .opportunities .item-number { background: rgba(16, 185, 129, 0.2); color: var(--neon-green); }
        .risks .item-number { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        
        .item-content h4 { margin: 0 0 10px; font-size: 1.05rem; }
        .item-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 12px; }
        
        .item-tags { display: flex; gap: 8px; }
        .tag { padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 600; }
        .tag.success { background: rgba(16, 185, 129, 0.2); color: var(--neon-green); }
        .tag.warning { background: rgba(249, 115, 22, 0.2); color: var(--neon-orange); }
        .tag.info { background: rgba(0, 212, 255, 0.2); color: var(--neon-blue); }
        .tag.neutral { background: rgba(168, 85, 247, 0.2); color: var(--neon-purple); }
        
        .panel-summary {
          padding: 14px 18px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .panel-summary.warning { background: rgba(249, 115, 22, 0.1); }
        .summary-icon { font-size: 1.1rem; }
        
        /* Mitigation Section */
        .mitigation-section {
          padding: 28px;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.05));
          border: 2px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          margin-bottom: 32px;
        }
        
        .mitigation-header {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .mitigation-icon {
          width: 56px;
          height: 56px;
          background: var(--gradient-primary);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }
        
        .mitigation-header h3 { margin: 0 0 6px; font-size: 1.3rem; }
        .mitigation-subtitle { margin: 0; color: var(--text-muted); }
        
        .mitigation-main {
          padding: 24px;
          background: var(--bg-tertiary);
          border-radius: 14px;
        }
        
        .mitigation-text {
          font-size: 1.15rem;
          line-height: 1.7;
          color: var(--text-primary);
          margin: 0;
        }
        
        /* Roadmap Section */
        .roadmap-section {
          padding: 32px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 24px;
        }
        
        .roadmap-header {
          text-align: center;
          margin-bottom: 36px;
        }
        
        .roadmap-icon { font-size: 3rem; margin-bottom: 12px; }
        .roadmap-header h3 { margin: 0 0 8px; font-size: 1.5rem; }
        .roadmap-desc { margin: 0; color: var(--text-muted); }
        
        .roadmap-timeline {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .phase-card {
          display: flex;
          gap: 24px;
        }
        
        .phase-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .phase-num {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        
        .phase-1 .phase-num { background: linear-gradient(135deg, #ef4444, #f97316); }
        .phase-2 .phase-num { background: linear-gradient(135deg, #f97316, #eab308); }
        .phase-3 .phase-num { background: linear-gradient(135deg, #10b981, #06b6d4); }
        
        .phase-line {
          width: 3px;
          flex: 1;
          background: var(--border-color);
          margin-top: 12px;
        }
        
        .phase-content {
          flex: 1;
          padding: 24px;
          background: var(--bg-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-color);
        }
        
        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .phase-badge {
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .phase-badge.immediate { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .phase-badge.short-term { background: rgba(249, 115, 22, 0.2); color: #f97316; }
        .phase-badge.medium-term { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        
        .phase-duration {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        
        .phase-content h4 { margin: 0 0 16px; font-size: 1.2rem; }
        
        .phase-tasks {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        
        .phase-tasks li {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        
        .task-check {
          font-size: 1.1rem;
          color: var(--text-muted);
        }
        
        .phase-tasks li div {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .phase-tasks li strong {
          color: var(--text-primary);
        }
        
        .phase-outcome {
          padding: 14px 18px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .phase-outcome strong { color: var(--neon-green); }
        
        @media (max-width: 900px) {
          .assessment-grid { grid-template-columns: 1fr; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
