from fastapi import APIRouter, Depends, HTTPException

from app.auth import authenticate_user, create_access_token, get_current_user, register_user
from app.models.schemas import (
    CompetitorSnapshot,
    IdeaGenerationResponse,
    IdeaInput,
    LoginRequest,
    MarketInsight,
    PartnerProfile,
    Portfolio,
    PortfolioRequest,
    RefinedIdea,
    RegisterRequest,
    RiskOpportunity,
    TokenResponse,
    ValidationScore,
    ValidationRequest,
)
from app.services.competitor_analysis import competitor_snapshot
from app.services.idea_generator import generate_refined_ideas
from app.services.market_insights import generate_market_insight
from app.services.partner_matcher import matcher
from app.services.portfolio_builder import build_portfolio
from app.services.risk_opportunity import assess_risks
from app.services.validation_scorer import score_validation


router = APIRouter(prefix="/api")


@router.post("/auth/register", response_model=TokenResponse)
def register(payload: RegisterRequest):
    user = register_user(
        payload.email,
        payload.password,
        {
            "interests": payload.interests or [],
            "skills": payload.skills or [],
            "location": payload.location or "",
            "name": payload.email.split("@")[0],
        },
    )
    token = create_access_token({"sub": user["id"], "email": user["email"]})
    return TokenResponse(access_token=token)


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = authenticate_user(payload.email, payload.password)
    token = create_access_token({"sub": user["id"], "email": user["email"]})
    return TokenResponse(access_token=token)


@router.get("/auth/me")
def me(user=Depends(get_current_user)):
    return {"user": user}


@router.put("/auth/profile")
def update_profile(payload: dict, user=Depends(get_current_user)):
    """Update user profile (interests, skills, etc)."""
    from app.database import get_supabase, is_supabase_configured
    
    profile_data = payload.get("profile", {})
    
    if is_supabase_configured():
        client = get_supabase()
        client.table("users").update({
            "profile": profile_data
        }).eq("id", user["id"]).execute()
    
    # Update in-memory user
    user["profile"] = profile_data
    return {"success": True, "profile": profile_data}


@router.post("/ideas/generate", response_model=IdeaGenerationResponse)
def ideas_generate(payload: IdeaInput):
    ideas = generate_refined_ideas(payload.idea)
    return IdeaGenerationResponse(ideas=ideas)


@router.post("/ideas/insights", response_model=MarketInsight)
def ideas_insights(idea: RefinedIdea):
    return generate_market_insight(idea)


@router.post("/ideas/competitors", response_model=CompetitorSnapshot)
def ideas_competitors(idea: RefinedIdea):
    return competitor_snapshot(idea)


@router.post("/ideas/assessment", response_model=RiskOpportunity)
def ideas_assessment(idea: RefinedIdea):
    return assess_risks(idea)


@router.post("/ideas/validate", response_model=ValidationScore)
def ideas_validate(payload: ValidationRequest):
    return score_validation(payload.market, payload.competitors)


@router.post("/ideas/summary")
def ideas_summary(portfolio_req: PortfolioRequest):
    # Render only summary (HTML)
    from app.services.summary_generator import render_summary_html

    html = render_summary_html(
        portfolio_req.idea,
        portfolio_req.market_insight,
        portfolio_req.competitor_snapshot,
        portfolio_req.risk_opportunity,
        portfolio_req.validation_score,
        portfolio_req.partners,
    )
    return {"html": html}


@router.get("/partners/suggest", response_model=list[PartnerProfile])
def partners_suggest(user=Depends(get_current_user)):
    profile = user.get("profile") or {}
    return matcher.suggest(profile, limit=3)


@router.post("/portfolio/build", response_model=Portfolio)
def portfolio_build(payload: IdeaInput, user=Depends(get_current_user)):
    profile = user.get("profile") or {}
    return build_portfolio(profile, payload.idea)

@router.post("/chat")
def chat(payload: dict):
    """AI Chatbot endpoint for user assistance."""
    from openai import OpenAI
    from app.config import settings
    
    message = payload.get("message", "").lower()
    
    # Try OpenRouter API first
    api_key = settings.openrouter_api_key
    if api_key and len(api_key) > 20:
        try:
            client = OpenAI(
                base_url=settings.openrouter_base_url,
                api_key=api_key,
            )
            
            system_prompt = """You are BizBloom AI Assistant, a helpful chatbot for a startup validation platform called BizBloom AI.

Platform Features:
1. AI Idea Refinement - Generates 3 polished startup ideas from raw input
2. Market Insights - Industry classification, trends, customer segments
3. Competitor Analysis - NLP-based similarity search across startup database
4. Risk Assessment - Opportunities, risks, mitigation strategies
5. Validation Score - Feasibility, novelty, market readiness ratings
6. Partner Matching - Find co-founders based on skills and interests
7. AI Chatbot (You!) - Help users navigate and understand the platform

Navigation:
- Dashboard: Main workspace for idea generation and analysis
- Profile: Set interests, skills, business focus
- Portfolio: View saved ideas and analyses

How the platform works:
1. User logs in/registers
2. Selects an industry (EdTech, FinTech, HealthTech, AI/ML, SaaS, E-commerce, FoodTech, Developer Tools, Productivity, Communication)
3. Describes their startup idea
4. Clicks "Generate AI Ideas" to get 3 refined versions
5. Selects one idea to see full analysis (Market, Competitors, Risks, Scores, Partners)

Be concise, friendly, and helpful. Use bullet points and emojis. Answer based on the platform context above."""

            response = client.chat.completions.create(
                model=settings.openrouter_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": payload.get("message", "")}
                ],
                max_tokens=400,
                temperature=0.7,
            )
            
            content = response.choices[0].message.content
            if content:
                return {"response": content}
        except Exception as e:
            print(f"[WARN] Chat API error: {e}")
    
    # Intelligent fallback based on keywords
    if "start" in message or "begin" in message or "how do i" in message:
        return {"response": "🚀 **Getting Started:**\n\n1. **Login/Register** on the homepage\n2. Go to **Dashboard**\n3. **Select your industry** (EdTech, FinTech, etc.)\n4. **Describe your idea** in 2-3 sentences\n5. Click **Generate AI Ideas**\n6. Select one to see full analysis!"}
    
    if "feature" in message or "what can" in message or "offer" in message:
        return {"response": "✨ **BizBloom AI Features:**\n\n1. **AI Idea Refinement** - Get 3 polished versions\n2. **Market Insights** - Industry trends & segments\n3. **Competitor Analysis** - Find similar startups\n4. **Risk Assessment** - Opportunities & mitigation\n5. **Validation Score** - Feasibility & novelty ratings\n6. **Partner Matching** - Find co-founders\n7. **AI Assistant** - That's me! 😊"}
    
    if "risk" in message or "opportunity" in message:
        return {"response": "⚡ **Risk Assessment:**\n\nAfter generating ideas:\n1. Click on an idea to analyze it\n2. Go to the **Risks & Opportunities** tab\n3. You'll see:\n   - Growth opportunities\n   - Potential risks\n   - Mitigation strategies\n   - Implementation roadmap"}
    
    if "partner" in message or "co-founder" in message or "cofounder" in message:
        return {"response": "🤝 **Finding Partners:**\n\n1. Complete your **Profile** (interests & skills)\n2. Generate and analyze an idea\n3. Go to the **Partners** tab\n4. See matched co-founders with:\n   - Match score based on NLP\n   - Skills & expertise\n   - LinkedIn profiles to connect!"}
    
    if "competitor" in message or "competition" in message:
        return {"response": "🏆 **Competitor Analysis:**\n\nWe use **NLP + FAISS** to find similar startups:\n1. Your idea is embedded using AI\n2. We search our database of 40+ startups\n3. Top matches are shown with:\n   - Similarity score\n   - Description\n   - Market gap opportunities"}
    
    if "score" in message or "validation" in message or "feasibility" in message:
        return {"response": "📈 **Validation Scoring:**\n\nWe provide 3 scores:\n- **Feasibility** (0-100): Can you build this?\n- **Novelty** (0-100): How unique is it?\n- **Market Readiness**: High/Medium/Low\n\nEach score includes AI-generated reasoning."}
    
    if "market" in message or "trend" in message or "industry" in message:
        return {"response": "📊 **Market Insights:**\n\nWe analyze:\n- **Industry classification** using AI\n- **Top market trends** from our dataset\n- **Customer segments** you should target\n\nThis helps you understand your market positioning!"}
    
    if "dashboard" in message or "navigate" in message or "where" in message:
        return {"response": "🧭 **Navigation Guide:**\n\n- **Dashboard** - Generate & analyze ideas\n- **Profile** - Set your interests & skills\n- **Portfolio** - View saved analyses\n\nStart at Dashboard → Select Industry → Enter Idea → Generate!"}
    
    if "hello" in message or "hi" in message or "hey" in message:
        return {"response": "👋 Hello! I'm BizBloom AI Assistant.\n\nI can help you:\n• Navigate the platform\n• Explain features\n• Give startup advice\n\nTry asking: 'How do I start?' or 'What features do you offer?'"}
    
    return {"response": "I'm here to help! You can ask me about:\n\n• **Getting started** with the platform\n• **Features** like market insights, competitor analysis\n• **Risk assessment** and mitigation\n• **Finding co-founders**\n• **Navigation** help\n\nWhat would you like to know?"}
