import  {Link} from "react-router-dom";
import { Search, Menu } from "lucide-react";
import "../styles/Navbar.css";



function Navbar(){
    return(
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                Hardware<span>Hub</span>
                </Link>

                <nav className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/categories">Categories</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                
                </nav>

                <div className="nav-actions">
                <button className="icon-button" aria-label="Search">
                <Search size={20} />
                </button>

                <Link to="/admin/login" className="login-button">
                 Admin
                </Link>

                <button className="mobile-menu" aria-label="Menu">
                <Menu size={22} />
                </button>
                </div>

            </div>
        </header> 
    );

}
export default Navbar;
