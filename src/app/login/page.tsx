import GithubLoginButton from "@/components/login/githubLoginButton/GithubLoginButton/GithubLoginButton";
import LoginPageIntro from "@/components/login/loginPageIntro/LoginPageIntro";
import "./page.scss";

const login =() =>{
    return (
        <div className="login-page">
          <div className="login-page__space--top" />
          <LoginPageIntro />
          <div className="login-page__space--bottom" />
          <GithubLoginButton />
        </div>
      );
}

export default login;