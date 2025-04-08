import "./Header.css"
import logo from "./images/monochrome.jpg"

function Header() {
    return (
        <div className="header">
            <img src={logo} alt="Logo" className="logo"></img>
        </div>
    )
}

export default Header
