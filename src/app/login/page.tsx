import GithubLoginButton from "@/components/login/githubloginbuttion/GithubLoginButtion";
import LoginDescription from "@/components/login/logindescription/LoginDescription";

const login =() =>{
    return(
        <div>
            <LoginDescription/>
            <GithubLoginButton/>
        </div>
    )
}

export default login;