import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import UseTransitionDemo from "./pages/useTransitionDemo";
import UseDeferredValueDemo from "./pages/useDeferredValueDemo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/useTransition" element={<UseTransitionDemo />} />
        <Route path="/useDeferredValue" element={<UseDeferredValueDemo />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div className="home-container">
      <h1 className="welcome-title">欢迎来到 React 演示应用</h1>
      <p className="instruction-text">请选择以下演示页面进行浏览。</p>
      <div className="demo-links">
        <h2 className="demo-list-title">可用演示:</h2>
        <Link to="/useTransition" className="demo-link">useTransition 演示</Link>
        <Link to="/useDeferredValue" className="demo-link">useDeferredValue 演示</Link>
      </div>
    </div>
  );
}

export default App;
