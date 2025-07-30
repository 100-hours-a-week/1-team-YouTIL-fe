import HeaderBackButton from "../headerBackButton/HeaderBackButton";
import HeaderLogo from "../headerLogo/HeaderLogo";
import HeaderLogoutButton from "../headerLogoutButton/HeaderLogoutButton";

import './Header.scss';

const Header =() =>{
    return(
        <header className="header__place">
            <nav className="header__button">
                <HeaderBackButton />
                <HeaderLogo />
                <HeaderLogoutButton />
            </nav>
        </header>
    )
}

export default Header;
