import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "👋 Hi! I'm BizBloom AI Assistant. I can help you:\n\n• Navigate the platform\n• Explain features\n• Give startup advice\n• Answer questions\n\nHow can I help you today?"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickActions = [
        { label: "How do I start?", action: "How do I start validating my startup idea?" },
        { label: "What features?", action: "What features does BizBloom AI offer?" },
        { label: "Help with risks", action: "How do I assess risks for my startup?" },
        { label: "Find partners", action: "How can I find co-founders?" },
    ];

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMessage = { role: "user", content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const { data } = await api.post("/chat", { message: text });
            setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
        } catch (err) {
            // Fallback responses if API fails
            const fallbackResponse = getFallbackResponse(text);
            setMessages(prev => [...prev, { role: "assistant", content: fallbackResponse }]);
        }
        setLoading(false);
    };

    const getFallbackResponse = (query) => {
        const q = query.toLowerCase();

        if (q.includes("start") || q.includes("begin") || q.includes("how do i")) {
            return "🚀 **Getting Started:**\n\n1. **Login/Register** on the homepage\n2. Go to **Dashboard**\n3. **Select your industry** (EdTech, FinTech, etc.)\n4. **Describe your idea** in 2-3 sentences\n5. Click **Generate AI Ideas**\n6. Select one to see full analysis!";
        }

        if (q.includes("feature") || q.includes("what can") || q.includes("offer")) {
            return "✨ **BizBloom AI Features:**\n\n1. **AI Idea Refinement** - Get 3 polished versions of your idea\n2. **Market Insights** - Industry trends & customer segments\n3. **Competitor Analysis** - Find similar startups\n4. **Risk Assessment** - Opportunities & mitigation strategies\n5. **Validation Score** - Feasibility & novelty ratings\n6. **Partner Matching** - Find co-founders\n7. **AI Assistant** - That's me! 😊";
        }

        if (q.includes("risk") || q.includes("opportunity")) {
            return "⚡ **Risk Assessment:**\n\nAfter generating ideas:\n1. Click on an idea to analyze it\n2. Go to the **Risks & Opportunities** tab\n3. You'll see:\n   - Growth opportunities\n   - Potential risks\n   - Mitigation strategies\n   - Implementation roadmap";
        }

        if (q.includes("partner") || q.includes("co-founder") || q.includes("cofounder")) {
            return "🤝 **Finding Partners:**\n\n1. Complete your **Profile** (interests & skills)\n2. Generate and analyze an idea\n3. Go to the **Partners** tab\n4. See matched co-founders with:\n   - Match score based on NLP\n   - Skills & expertise\n   - LinkedIn profiles to connect!";
        }

        if (q.includes("competitor") || q.includes("competition")) {
            return "🏆 **Competitor Analysis:**\n\nWe use **NLP + FAISS** to find similar startups:\n1. Your idea is embedded using AI\n2. We search our database of 40+ startups\n3. Top matches are shown with:\n   - Similarity score\n   - Description\n   - Market gap opportunities";
        }

        if (q.includes("score") || q.includes("validation") || q.includes("feasibility")) {
            return "📈 **Validation Scoring:**\n\nWe provide 3 scores:\n- **Feasibility** (0-100): Can you build this?\n- **Novelty** (0-100): How unique is it?\n- **Market Readiness**: High/Medium/Low\n\nEach score includes reasoning to help you understand the assessment.";
        }

        if (q.includes("market") || q.includes("trend") || q.includes("industry")) {
            return "📊 **Market Insights:**\n\nWe analyze:\n- **Industry classification** using AI\n- **Top market trends** from our dataset\n- **Customer segments** you should target\n\nThis helps you understand your market positioning!";
        }

        return "I'm here to help! You can ask me about:\n\n• **Getting started** with the platform\n• **Features** like market insights, competitor analysis\n• **Risk assessment** and mitigation\n• **Finding co-founders**\n• **Navigation** help\n\nWhat would you like to know?";
    };

    return (
        <>
            {/* Chat Button */}
            <button
                className="chat-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "✕" : "💬"}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span className="chat-title">🤖 BizBloom Assistant</span>
                        <span className="chat-status">● Online</span>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-content">
                                    {msg.content.split('\n').map((line, i) => (
                                        <span key={i}>
                                            {line}
                                            {i < msg.content.split('\n').length - 1 && <br />}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message assistant">
                                <div className="message-content typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        {quickActions.map((qa, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(qa.action)}
                                disabled={loading}
                            >
                                {qa.label}
                            </button>
                        ))}
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask me anything..."
                            disabled={loading}
                        />
                        <button onClick={() => handleSend()} disabled={loading || !input.trim()}>
                            ➤
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        .chat-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--gradient-primary);
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .chat-toggle:hover {
          transform: scale(1.1);
        }
        
        .chat-window {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 380px;
          height: 500px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .chat-header {
          padding: 16px 20px;
          background: var(--gradient-primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .chat-title {
          font-weight: 600;
          font-size: 1rem;
        }
        
        .chat-status {
          font-size: 0.8rem;
          color: #10b981;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .message {
          max-width: 85%;
          animation: fadeIn 0.3s ease;
        }
        
        .message.user {
          align-self: flex-end;
        }
        
        .message.assistant {
          align-self: flex-start;
        }
        
        .message-content {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        .message.user .message-content {
          background: var(--gradient-primary);
          border-bottom-right-radius: 4px;
        }
        
        .message.assistant .message-content {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-bottom-left-radius: 4px;
        }
        
        .typing {
          display: flex;
          gap: 4px;
          padding: 16px !important;
        }
        
        .typing span {
          width: 8px;
          height: 8px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }
        
        .typing span:nth-child(1) { animation-delay: -0.32s; }
        .typing span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        .quick-actions {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          overflow-x: auto;
          border-top: 1px solid var(--border-color);
        }
        
        .quick-actions button {
          padding: 6px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 100px;
          font-size: 0.75rem;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .quick-actions button:hover {
          background: var(--gradient-primary);
          border-color: transparent;
        }
        
        .chat-input {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-top: 1px solid var(--border-color);
        }
        
        .chat-input input {
          flex: 1;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 100px;
          color: inherit;
          font-size: 0.9rem;
        }
        
        .chat-input input:focus {
          outline: none;
          border-color: var(--neon-blue);
        }
        
        .chat-input button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--gradient-primary);
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          transition: transform 0.2s;
        }
        
        .chat-input button:hover:not(:disabled) {
          transform: scale(1.1);
        }
        
        .chat-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 480px) {
          .chat-window {
            width: calc(100% - 32px);
            right: 16px;
            bottom: 90px;
            height: 60vh;
          }
        }
      `}</style>
        </>
    );
}
