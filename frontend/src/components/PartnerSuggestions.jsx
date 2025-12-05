export default function PartnerSuggestions({ partners }) {
  return (
    <div className="card">
      <h4>Partner Suggestions</h4>
      <ul>
        {partners.map((p, idx) => (
          <li key={idx}>
            <strong>{p.name}</strong> — overlap {p.interest_overlap_score} | Skills: {p.skills?.join(", ")} | Contact: {p.contact_hint}
          </li>
        ))}
      </ul>
    </div>
  );
}

