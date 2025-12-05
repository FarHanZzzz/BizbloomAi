import { useState } from "react";
import { api } from "../services/api";
import IdeaCard from "../components/IdeaCard";

export default function Portfolio() {
  const [ideaText, setIdeaText] = useState("");
  const [portfolio, setPortfolio] = useState(null);

  const build = async () => {
    const { data } = await api.post("/portfolio/build", { idea: ideaText });
    setPortfolio(data);
  };

  return (
    <div className="card">
      <h3>Build Portfolio</h3>
      <textarea className="input" rows="4" value={ideaText} onChange={(e) => setIdeaText(e.target.value)} />
      <br />
      <button className="button" onClick={build}>Build</button>
      {portfolio && (
        <div style={{ marginTop: 16 }}>
          <p>Portfolio ID: {portfolio.portfolio_id}</p>
          {portfolio.pdf_url && <a href={portfolio.pdf_url}>Download PDF</a>}
          <IdeaCard idea={portfolio.data.idea} />
        </div>
      )}
    </div>
  );
}

