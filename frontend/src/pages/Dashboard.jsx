import { useState } from "react";
import IdeaCard from "../components/IdeaCard";
import MarketInsights from "../components/MarketInsights";
import CompetitorPanel from "../components/CompetitorPanel";
import ValidationScore from "../components/ValidationScore";
import PartnerSuggestions from "../components/PartnerSuggestions";
import { api } from "../services/api";

export default function Dashboard() {
  const [ideaInput, setIdeaInput] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [market, setMarket] = useState(null);
  const [competitors, setCompetitors] = useState(null);
  const [risks, setRisks] = useState(null);
  const [scores, setScores] = useState(null);
  const [partners, setPartners] = useState([]);

  const generateIdeas = async () => {
    const { data } = await api.post("/ideas/generate", { idea: ideaInput });
    setIdeas(data.ideas);
    setSelected(data.ideas[0]);
  };

  const runPipelines = async () => {
    if (!selected) return;
    const { data: mkt } = await api.post("/ideas/insights", selected);
    setMarket(mkt);
    const { data: comps } = await api.post("/ideas/competitors", selected);
    setCompetitors(comps);
    const { data: ro } = await api.post("/ideas/assessment", selected);
    setRisks(ro);
    const { data: sc } = await api.post("/ideas/validate", {
      idea: selected,
      market: mkt,
      competitors: comps,
    });
    setScores(sc);
    const { data: partnersData } = await api.get("/partners/suggest");
    setPartners(partnersData);
  };

  return (
    <div className="grid two">
      <div className="card">
        <h3>Enter your idea</h3>
        <textarea className="input" rows="4" value={ideaInput} onChange={(e) => setIdeaInput(e.target.value)} />
        <br />
        <button className="button" onClick={generateIdeas}>Generate Ideas</button>
      </div>

      <div>
        {ideas.map((idea, idx) => (
          <IdeaCard key={idx} idea={idea} onSelect={() => setSelected(idea)} selected={selected?.name === idea.name} />
        ))}
        {selected && (
          <button className="button" onClick={runPipelines}>Run Insights</button>
        )}
      </div>

      {market && <MarketInsights insight={market} />}
      {competitors && <CompetitorPanel snapshot={competitors} />}
      {scores && <ValidationScore scores={scores} />}
      {partners.length > 0 && <PartnerSuggestions partners={partners} />}
    </div>
  );
}

