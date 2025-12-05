import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Chatbot from "./components/Chatbot";
import { useAuth } from "./context/AuthContext";

const Layout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">🌸 BizBloom AI</Link>
        <nav>
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={isActive('/dashboard') ? 'active' : ''}
              >
                Dashboard
              </Link>
              <Link 
                to="/portfolio" 
                className={isActive('/portfolio') ? 'active' : ''}
              >
                Portfolio
              </Link>
              <Link 
                to="/profile" 
                className={isActive('/profile') ? 'active' : ''}
              >
                Profile
              </Link>
              <button className="nav-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/">Get Started</Link>
          )}
        </nav>
      </header>
      <main className="content">{children}</main>
      
      <style>{`
        .nav-button {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 10px 20px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: color 0.2s ease;
          font-family: inherit;
        }
        
        .nav-button:hover {
          color: var(--neon-pink);
        }
      `}</style>
    </div>
  );
};

export default function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />
          } />
          <Route path="/dashboard" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" />
          } />
          <Route path="/portfolio" element={
            isAuthenticated ? <Portfolio /> : <Navigate to="/" />
          } />
          <Route path="/profile" element={
            isAuthenticated ? <Profile /> : <Navigate to="/" />
          } />
        </Routes>
      </Layout>
      <Chatbot />
    </>
  );
}
