import { Routes, Route, Navigate, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import { useAuth } from "./context/AuthContext";

const Layout = ({ children }) => (
  <div className="app-shell">
    <header className="topbar">
      <Link to="/" className="brand">BizBloom AI</Link>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/portfolio">Portfolio</Link>
      </nav>
    </header>
    <main className="content">{children}</main>
  </div>
);

export default function App() {
  const { token } = useAuth();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/portfolio" element={token ? <Portfolio /> : <Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

