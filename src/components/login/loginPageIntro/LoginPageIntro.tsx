'use client';
import Image from 'next/image';
import './LoginPageIntro.scss';

const LoginPageIntro = () => {
  return (
    <div className="login-intro">
      <Image
        src="/images/loginDescription.png"
        alt="YouTIL Login"
        width={600}
        height={165}
        priority
        className="login-intro__image"
      />

      <Image
        src="/images/loginIntroduction.png"
        alt="youTIL introduction"
        width={300}
        height={165}
        priority
        className="login-intro__image"
      />

        <div className="login-intro__notice">
            <div className='login-intro__notice--title'>주의 사항</div>
            <div className='login-intro__notice--content'>
                깃허브 로그인 시 원하는 조직에 대해 <br />
                권한 설정을 허용해야 해당 조직의 커밋을 조회할 수 있습니다!
            </div>
        </div>
    </div>
  );
};

export default LoginPageIntro;
