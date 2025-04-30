import GithubLoginButton from "@/components/login/githubLoginButton/GithubLoginButton";
import LoginDescription from "@/components/login/loginDescription/LoginDescription";
import "./page.scss";

const login =() =>{
    return(
        <div className="login-page">
            <div className="login-space-1"></div>
            <LoginDescription/>
            <div className="login-space-2"></div>
            <GithubLoginButton/>
        </div>
    )
}

export default login;