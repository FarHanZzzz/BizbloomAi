from pathlib import Path
from typing import Optional

from jinja2 import Template

from app.config import settings
from app.models.schemas import (
    CompetitorSnapshot,
    MarketInsight,
    PartnerProfile,
    RefinedIdea,
    RiskOpportunity,
    ValidationScore,
)


HTML_TEMPLATE = """
<html>
<head>
    <style>
    body { font-family: Arial, sans-serif; margin: 24px; }
    h1 { color: #0f172a; }
    h2 { color: #334155; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card { padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; }
    ul { padding-left: 18px; }
    </style>
</head>
<body>
    <h1>{{ idea.name }}</h1>
    <p><strong>Problem:</strong> {{ idea.problem }}</p>
    <p><strong>Solution:</strong> {{ idea.solution }}</p>
    <p><strong>Value:</strong> {{ idea.value_proposition }}</p>

    <h2>Market Overview</h2>
    <div class="card">
        <p><strong>Industry:</strong> {{ market.industry }}</p>
        <p><strong>Trends:</strong> {{ market.top_trends | join(', ') }}</p>
        <p><strong>Segments:</strong> {{ market.customer_segments | join(', ') }}</p>
    </div>

    <h2>Competitors</h2>
    <div class="card">
        <ul>
        {% for c in competitors.competitors %}
            <li><strong>{{ c.name }}</strong>: {{ c.short_description }}{% if c.url_if_known %} ({{ c.url_if_known }}){% endif %}</li>
        {% endfor %}
        </ul>
        <p><strong>Market Gap:</strong> {{ competitors.market_gap }}</p>
    </div>

    <h2>Opportunities & Risks</h2>
    <div class="grid">
        <div class="card">
            <h3>Opportunities</h3>
            <ul>
            {% for o in risk.opportunities %}<li>{{ o }}</li>{% endfor %}
            </ul>
        </div>
        <div class="card">
            <h3>Risks</h3>
            <ul>
            {% for r in risk.risks %}<li>{{ r }}</li>{% endfor %}
            </ul>
            <p><strong>Mitigation:</strong> {{ risk.mitigation }}</p>
        </div>
    </div>

    <h2>Validation Scores</h2>
    <div class="card">
        <p>Feasibility: {{ scores.feasibility_score }}/100</p>
        <p>Novelty: {{ scores.novelty_score }}/100</p>
        <p>Market Readiness: {{ scores.market_readiness }}</p>
    </div>

    <h2>Partner Suggestions</h2>
    <div class="card">
        <ul>
        {% for p in partners %}
            <li><strong>{{ p.name }}</strong> — overlap {{ '%.2f' % p.interest_overlap_score }} | Skills: {{ p.skills | join(', ') }} | Contact: {{ p.contact_hint }}</li>
        {% endfor %}
        </ul>
    </div>
</body>
</html>
"""


def render_summary_html(
    idea: RefinedIdea,
    market: MarketInsight,
    competitors: CompetitorSnapshot,
    risk: RiskOpportunity,
    scores: ValidationScore,
    partners: list[PartnerProfile],
) -> str:
    template = Template(HTML_TEMPLATE)
    return template.render(
        idea=idea,
        market=market,
        competitors=competitors,
        risk=risk,
        scores=scores,
        partners=partners,
    )


def generate_pdf(html: str, filename: str = "portfolio.pdf") -> Optional[str]:
    """
    Attempt to render HTML to PDF. If WeasyPrint is unavailable in the environment,
    return None and let callers fall back to HTML-only response.
    """
    try:
        from weasyprint import HTML  # type: ignore
    except Exception:
        return None

    output_path = Path(settings.processed_dir) / filename
    output_path.parent.mkdir(parents=True, exist_ok=True)
    HTML(string=html).write_pdf(str(output_path))
    return str(output_path)

