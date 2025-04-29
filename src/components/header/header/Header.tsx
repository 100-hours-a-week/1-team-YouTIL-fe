import HeaderBackButton from "../headerBackButton/HeaderBackButton";
import HeaderLogo from "../headerLogo/HeaderLogo";
import HeaderLogoutButton from "../headerLogoutButton/HeaderLogoutButton";

import './Header.scss';

const Header =() =>{
    return(
        <div className="header-place">
            <div className="header-button">
                <HeaderBackButton/>
                <HeaderLogo/>
                <HeaderLogoutButton/>
            </div>
        </div>
    )
}

export default Header;