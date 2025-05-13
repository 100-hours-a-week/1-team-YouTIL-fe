'use client';

import { Suspense } from "react";
import GithubLoginButton from "@/components/login/githubLoginButton/GithubLoginButton/GithubLoginButton";
import LoginPageIntro from "@/components/login/loginPageIntro/LoginPageIntro";
import "./page.scss";

const login = () => {
  return (
    <div className="login-page">
      <div className="login-page__space--top" />
      <LoginPageIntro />
      <div className="login-page__space--bottom" />
      
      <Suspense fallback={<div>로그인 버튼 로딩 중...</div>}>
        <GithubLoginButton />
      </Suspense>
    </div>
  );
};

export default login;
