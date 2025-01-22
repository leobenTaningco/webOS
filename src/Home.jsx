import React, { useState } from "react";
import {Link} from "react-router-dom";
import "./home.css"; // Assuming home.css is in the same directory

const Home = () => {
  // State to handle whether the home menu is active or not
  const [isMenuActive, setMenuActive] = useState(false);

  // Toggle menu visibility
  const handleTaskbarClick = () => {
    setMenuActive(!isMenuActive);
  };

  return (
    <div>
      <div className="bg"></div>
      <div className="taskbar">
        <div
          className="taskbar-start"
          onClick={handleTaskbarClick}
        >
            <div className={`home-menu ${isMenuActive ? "active" : ""}`}>
                {isMenuActive && ( // If true, it renders everything inside this parenthesis
                    <div className="footer-menu">
                    <Link to="/" className="logout"></Link>
                    <div className="user-pic"></div>
                    <div className="user-name">Yzowe</div>
                    </div>
                )}    
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
