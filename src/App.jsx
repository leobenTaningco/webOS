import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Login from './Login.jsx';  // 
import Home from './Home.jsx';  // 

function App() {
  return (
    <Router> {/* This wraps the entire app to enable routing */}
      <Routes> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/" element={<Login />} /> 
      </Routes>
    </Router>
  );
}

export default App;
