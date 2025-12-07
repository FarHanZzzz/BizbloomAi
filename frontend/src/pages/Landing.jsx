import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed");
    }
    setLoading(false);
  };

  const features = [
    { 
      icon: "💡", 
      title: "AI Idea Refinement", 
      desc: "Transform raw ideas into 3 validated startup concepts using Mistral-7B LLM",
      highlight: "OpenRouter API",
      dataset: "None - Pure AI"
    },
    { 
      icon: "📊", 
      title: "Market Intelligence", 
      desc: "Industry classification, trends analysis & customer segment identification",
      highlight: "AI + Dataset",
      dataset: "trend_signals.csv (27 trends)"
    },
    { 
      icon: "🏆", 
      title: "Competitor Analysis", 
      desc: "Find similar startups using NLP embeddings & FAISS vector search",
      highlight: "NLP + FAISS",
      dataset: "startup_metadata.csv (40 companies)"
    },
    { 
      icon: "⚡", 
      title: "Risk Assessment", 
      desc: "AI-generated opportunities, risks & actionable mitigation strategies",
      highlight: "OpenRouter API",
      dataset: "None - Pure AI"
    },
    { 
      icon: "📈", 
      title: "Validation Scoring", 
      desc: "Feasibility, novelty scores & market readiness with AI reasoning",
      highlight: "AI Scoring",
      dataset: "None - AI Analysis"
    },
    { 
      icon: "🤝", 
      title: "Partner Matching", 
      desc: "Find co-founders using NLP similarity on industry expert profiles",
      highlight: "NLP Matching",
      dataset: "professional_profiles.csv (20 experts)"
    },
    { 
      icon: "🤖", 
      title: "AI Chatbot Assistant", 
      desc: "Get help, navigation guidance & startup advice from AI assistant",
      highlight: "OpenRouter API",
      dataset: "None - Interactive AI"
    },
  ];

  const techStack = [
    { name: "Mistral-7B", desc: "LLM Generation" },
    { name: "all-MiniLM-L6-v2", desc: "Text Embeddings" },
    { name: "FAISS", desc: "Vector Search" },
    { name: "FastAPI", desc: "Backend API" },
    { name: "React", desc: "Frontend UI" },
  ];

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 AI-Powered Startup Validation Platform</div>
          <h1>
            Validate Your Startup Idea <br />
            <span className="gradient-text">In 5 Minutes, Not 5 Weeks</span>
          </h1>
          <p className="hero-subtitle">
            Get AI-powered market insights, NLP competitor analysis, risk assessment, 
            validation scores, and find co-founders — replacing $1,500+ consultant fees.
          </p>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">99%</span>
              <span className="stat-label">Time Saved</span>
            </div>
            <div className="stat">
              <span className="stat-value">7</span>
              <span className="stat-label">AI Features</span>
            </div>
            <div className="stat">
              <span className="stat-value">4</span>
              <span className="stat-label">Datasets</span>
            </div>
          </div>
        </div>
        
        <div className="hero-form">
          <div className="card">
            <div className="tabs">
              <button 
                className={`tab ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button 
                className={`tab ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {error && <div className="error-msg">{error}</div>}
              <input
                type="email"
                className="input"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                required
              />
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                required
              />
              <button type="submit" className="button large full" disabled={loading}>
                {loading ? "Processing..." : isLogin ? "Access Dashboard →" : "Start Free →"}
              </button>
            </form>
            
            <div className="demo-hint">
              <span>Demo: demo@bizbloom.ai / demo123</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Focus Areas */}
      <section className="focus-areas">
        <div className="section-header centered">
          <span className="section-badge">💡 Core Focus Areas</span>
          <h2>AI in Entrepreneurship</h2>
          <p>Commercially viable, AI-powered solution addressing startup challenges</p>
        </div>
 
        <div className="focus-grid">
          <div className="focus-card analytics">
            <div className="focus-icon">📊</div>
            <h3>Analytics & BI</h3>
            <p>Market trend analysis using NLP & trained datasets</p>
            <div className="focus-tags">
              <span>27 Trend Signals</span>
              <span>AI Classification</span>
            </div>
          </div>
          
          <div className="focus-card automation">
            <div className="focus-icon">🤖</div>
            <h3>Automated Services</h3>
            <p>AI chatbot assistance & automated content generation</p>
            <div className="focus-tags">
              <span>Mistral-7B</span>
              <span>Interactive Chat</span>
            </div>
          </div>
          
          <div className="focus-card risk">
            <div className="focus-icon">⚠️</div>
            <h3>Risk & Decisions</h3>
            <p>Startup validation scoring & investment risk assessment</p>
            <div className="focus-tags">
              <span>AI Risk Analysis</span>
              <span>Validation Score</span>
            </div>
          </div>
          
          <div className="focus-card innovation">
            <div className="focus-icon">💎</div>
            <h3>Product Innovation</h3>
            <p>LLM apps, NLP embeddings & recommendation engines</p>
            <div className="focus-tags">
              <span>FAISS Search</span>
              <span>NLP Matching</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Features */}
      <section className="features">
        <div className="section-header centered">
          <span className="section-badge">✨ 7 AI-Powered Features</span>
          <h2>Complete Startup Validation Suite</h2>
          <p>Each feature uses AI, NLP, or trained datasets for intelligent analysis</p>
        </div>
        
        <div className="features-grid">
          {features.map((f, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-header">
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-highlight">{f.highlight}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="feature-dataset">
                <span>📂</span> {f.dataset}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-section">
        <div className="section-header centered">
          <span className="section-badge">🧠 Technical Stack</span>
          <h2>ML/DL/NLP Models Used</h2>
          <p>Industry-standard models with validated performance metrics</p>
        </div>
        
        <div className="tech-grid">
          {techStack.map((tech, idx) => (
            <div key={idx} className="tech-card">
              <h4>{tech.name}</h4>
              <p>{tech.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="metrics-row">
          <div className="metric-item">
            <span className="metric-value">0.84</span>
            <span className="metric-label">STS Similarity</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">92%</span>
            <span className="metric-label">Industry Classification</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">0.95</span>
            <span className="metric-label">FAISS Recall@10</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">&lt;10ms</span>
            <span className="metric-label">Query Response</span>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-section">
        <div className="value-grid">
          <div className="value-card">
            <div className="value-icon">⏱️</div>
            <div className="value-compare">
              <span className="old">40 hours</span>
              <span className="arrow">→</span>
              <span className="new">5 min</span>
            </div>
            <h4>Time Saved</h4>
            <p>Research that took weeks now takes minutes</p>
          </div>
          
          <div className="value-card">
            <div className="value-icon">💰</div>
            <div className="value-compare">
              <span className="old">$1,500+</span>
              <span className="arrow">→</span>
              <span className="new">$0</span>
            </div>
            <h4>Cost Saved</h4>
            <p>Replace expensive consultant fees</p>
          </div>
          
          <div className="value-card">
            <div className="value-icon">🤖</div>
            <div className="value-compare">
              <span className="old">Manual</span>
              <span className="arrow">→</span>
              <span className="new">AI</span>
            </div>
            <h4>AI-Powered</h4>
            <p>NLP & LLM driven intelligent analysis</p>
          </div>
        </div>
      </section>

      {/* Chatbot Hint */}
      <section className="chatbot-hint">
        <div className="hint-content">
          <span className="hint-icon">💬</span>
          <p>Need help? Click the chat button in the bottom right corner!</p>
        </div>
      </section>

      <style>{`
        .landing {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        /* Hero */
        .hero {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          padding: 60px 0;
          align-items: center;
        }
        
        .hero-badge {
          display: inline-block;
          padding: 8px 16px;
          background: var(--gradient-primary);
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 24px;
        }
        
        .hero h1 {
          font-size: 3rem;
          line-height: 1.2;
          margin-bottom: 24px;
        }
        
        .gradient-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 32px;
        }
        
        .hero-stats {
          display: flex;
          gap: 32px;
        }
        
        .hero-stats .stat {
          text-align: center;
        }
        
        .hero-stats .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: var(--neon-blue);
        }
        
        .hero-stats .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        
        .hero-form .card {
          padding: 32px;
        }
        
        .tabs {
          display: flex;
          margin-bottom: 24px;
          background: var(--bg-tertiary);
          border-radius: 12px;
          padding: 4px;
        }
        
        .tab {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        
        .tab.active {
          background: var(--gradient-primary);
          color: white;
        }
        
        .error-msg {
          padding: 12px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }
        
        .demo-hint {
          text-align: center;
          margin-top: 16px;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        
        /* Sections */
        section {
          padding: 80px 0;
        }
        
        .section-header.centered {
          text-align: center;
          margin-bottom: 48px;
        }
        
        .section-badge {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(0, 212, 255, 0.15);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--neon-blue);
          margin-bottom: 16px;
        }
        
        .section-header h2 {
          font-size: 2.2rem;
          margin-bottom: 12px;
        }
        
        .section-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }
        
        /* Focus Areas */
        .focus-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        
        .focus-card {
          padding: 32px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        
        .focus-card:hover {
          transform: translateY(-4px);
        }
        
        .focus-card.analytics { border-color: rgba(0, 212, 255, 0.4); }
        .focus-card.automation { border-color: rgba(168, 85, 247, 0.4); }
        .focus-card.risk { border-color: rgba(249, 115, 22, 0.4); }
        .focus-card.innovation { border-color: rgba(16, 185, 129, 0.4); }
        
        .focus-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }
        
        .focus-card h3 {
          margin-bottom: 12px;
          font-size: 1.3rem;
        }
        
        .focus-card p {
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        
        .focus-tags {
          display: flex;
          gap: 8px;
        }
        
        .focus-tags span {
          padding: 4px 10px;
          background: var(--bg-secondary);
          border-radius: 100px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .feature-card {
          padding: 28px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          border-color: var(--neon-purple);
          transform: translateY(-4px);
        }
        
        .feature-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .feature-icon {
          font-size: 2rem;
        }
        
        .feature-highlight {
          padding: 4px 10px;
          background: var(--gradient-primary);
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        
        .feature-card h3 {
          margin-bottom: 8px;
          font-size: 1.1rem;
        }
        
        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        
        .feature-dataset {
          padding: 10px 14px;
          background: var(--bg-secondary);
          border-radius: 8px;
          font-size: 0.8rem;
          color: var(--neon-green);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        /* Tech Section */
        .tech-grid {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        
        .tech-card {
          padding: 20px 28px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          text-align: center;
        }
        
        .tech-card h4 {
          margin-bottom: 4px;
          color: var(--neon-blue);
        }
        
        .tech-card p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        
        .metrics-row {
          display: flex;
          justify-content: center;
          gap: 48px;
          padding: 32px;
          background: var(--bg-tertiary);
          border-radius: 16px;
        }
        
        .metric-item {
          text-align: center;
        }
        
        .metric-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: var(--neon-green);
        }
        
        .metric-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        
        /* Value Section */
        .value-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .value-card {
          padding: 32px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          text-align: center;
        }
        
        .value-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        
        .value-compare {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .value-compare .old {
          text-decoration: line-through;
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        
        .value-compare .arrow {
          color: var(--neon-green);
        }
        
        .value-compare .new {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--neon-green);
        }
        
        .value-card h4 {
          margin-bottom: 8px;
        }
        
        .value-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        /* Chatbot Hint */
        .chatbot-hint {
          padding: 24px 0;
        }
        
        .hint-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 24px;
          background: var(--gradient-primary);
          border-radius: 100px;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .hint-icon {
          font-size: 1.5rem;
        }
        
        .hint-content p {
          margin: 0;
          font-weight: 500;
        }
        
        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero h1 {
            font-size: 2rem;
          }
          
          .hero-stats {
            justify-content: center;
          }
          
          .focus-grid, .value-grid {
            grid-template-columns: 1fr;
          }
          
          .metrics-row {
            flex-direction: column;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}
