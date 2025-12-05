export default function ValidationScore({ scores }) {
  return (
    <div className="card">
      <h4>Validation Scores</h4>
      <p>Feasibility: {scores.feasibility_score}/100</p>
      <p>Novelty: {scores.novelty_score}/100</p>
      <p>Market Readiness: {scores.market_readiness}</p>
    </div>
  );
}

