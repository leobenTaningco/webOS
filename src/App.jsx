import './App.css';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Login from './Login.jsx';  // 
import Home from './Home.jsx';  // 

function App() {
  return (
    <Router> {/* This wraps the entire app to enable routing */}
      <Analytics />
      <SpeedInsights />
      <Routes> 
        <Route path="/" element={<Home />} /> 
        <Route path="/home" element={<Login />} /> 
      </Routes>
    </Router>
  );
}

export default App;
