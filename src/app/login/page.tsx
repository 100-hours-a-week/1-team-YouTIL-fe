import GithubLoginButton from "@/components/login/githubLoginButton/GithubLoginButton/GithubLoginButton";
import LoginPageIntro from "@/components/login/logindescription/LoginPageIntro";
import "./page.scss";

const login =() =>{
    return(
        <div className="login-page">
            <div className="login-space-1"></div>
            <LoginPageIntro/>
            <div className="login-space-2"></div>
            <GithubLoginButton/>
        </div>
    )
}

export default login;