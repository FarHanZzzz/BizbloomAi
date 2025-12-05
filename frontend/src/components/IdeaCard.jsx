export default function IdeaCard({ idea, onSelect, selected, index = 0 }) {
  const colors = ['purple', 'pink', 'blue'];
  const colorClass = colors[index % colors.length];
  
  return (
    <div 
      className={`card idea-card ${colorClass} ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
    >
      <div className="idea-header">
        <span className={`badge ${colorClass}`}>Idea {index + 1}</span>
        {selected && <span className="selected-indicator">✓ Selected</span>}
      </div>
      
      <h4 className="idea-name">{idea.name}</h4>
      
      <div className="idea-section">
        <span className="label">🔍 Problem</span>
        <p>{idea.problem}</p>
      </div>
      
      <div className="idea-section">
        <span className="label">💡 Solution</span>
        <p>{idea.solution}</p>
      </div>
      
      <div className="idea-section">
        <span className="label">✨ Value</span>
        <p>{idea.value_proposition}</p>
      </div>
      
      {onSelect && !selected && (
        <button className="button small select-btn" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          Select This Idea
        </button>
      )}

      <style>{`
        .idea-card {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .idea-card:hover {
          transform: translateY(-4px);
        }
        
        .idea-card.selected {
          border-width: 2px;
        }
        
        .idea-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .selected-indicator {
          color: var(--neon-green);
          font-weight: 600;
          font-size: 0.85rem;
        }
        
        .idea-name {
          font-size: 1.1rem;
          margin-bottom: 16px;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .idea-section {
          margin-bottom: 12px;
        }
        
        .idea-section .label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 4px;
        }
        
        .idea-section p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }
        
        .select-btn {
          width: 100%;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
}
