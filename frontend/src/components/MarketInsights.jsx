export default function MarketInsights({ insight }) {
  return (
    <div className="card">
      <h4>Market Insights</h4>
      <p><strong>Industry:</strong> {insight.industry}</p>
      <p><strong>Trends:</strong> {insight.top_trends?.join(", ")}</p>
      <p><strong>Segments:</strong> {insight.customer_segments?.join(", ")}</p>
    </div>
  );
}

