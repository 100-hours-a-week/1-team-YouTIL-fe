import GithubLoginButton from "@/components/login/githubLoginButton/GithubLoginButtion";
import LoginDescription from "@/components/login/loginDescription/LoginDescription";

const login =() =>{
    return(
        <div>
            <LoginDescription/>
            <GithubLoginButton/>
        </div>
    )
}

export default login;