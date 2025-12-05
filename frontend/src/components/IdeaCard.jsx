export default function IdeaCard({ idea, onSelect, selected }) {
  return (
    <div className="card" style={{ borderColor: selected ? "#2563eb" : "#e2e8f0" }}>
      <h4>{idea.name}</h4>
      <p><strong>Problem:</strong> {idea.problem}</p>
      <p><strong>Solution:</strong> {idea.solution}</p>
      <p><strong>Value:</strong> {idea.value_proposition}</p>
      {onSelect && <button className="button" onClick={onSelect}>Select</button>}
    </div>
  );
}

