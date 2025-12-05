export default function CompetitorPanel({ snapshot }) {
  return (
    <div className="card">
      <h4>Competitors</h4>
      <ul>
        {snapshot.competitors?.map((c, idx) => (
          <li key={idx}>
            <strong>{c.name}</strong>: {c.short_description} {c.url_if_known ? `(${c.url_if_known})` : ""}
          </li>
        ))}
      </ul>
      <p><strong>Market Gap:</strong> {snapshot.market_gap}</p>
    </div>
  );
}

