import "./login.css"; 
import { Link } from "react-router-dom";

const Login = () => {
    return (
    <div>
        <div className="bg-blurred"></div>

        <div>
            <Link to="/">
            <div className="profile-button">
                <div className="profile-text">hi :)</div>
                <div className="profile-name">Yzowe</div>
            </div>
            </Link>
        </div>
    </div>
  );
};

export default Login;
