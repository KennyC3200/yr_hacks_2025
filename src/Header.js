import "./Header.css"
import logo from "./images/logo.png"

function Header() {
    return (
        <div className="header">
            <div className="header-title">Google Reviews Scraper</div>
            <img src={logo} alt="Logo" className="logo"></img>
        </div>
    )
}

export default Header
