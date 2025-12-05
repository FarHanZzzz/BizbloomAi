import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await register(email, password);
    navigate("/dashboard");
  };

  return (
    <div className="card">
      <h2>Welcome to BizBloom AI</h2>
      <p>Turn your idea into a validated concept with one click.</p>
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button className="button" type="submit">Get Started</button>
      </form>
    </div>
  );
}

