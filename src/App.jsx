import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Correct imports for React Router v6
import Login from './Login.jsx';  // Import your Login component
import Home from './Home.jsx';  // Assuming you have a Home component

function App() {
  return (
    <Router> {/* This wraps the entire app to enable routing */}
      <Routes> {/* Switch is replaced with Routes in React Router v6 */}
        <Route path="/home" element={<Home />} /> {/* Home page route */}
        <Route path="/" element={<Login />} /> {/* Login page route */}
      </Routes>
    </Router>
  );
}

export default App;
