import logindescription from "public/logindescription.png"
import Image from "next/image";
const LoginPageIntro =() =>{
    return(
        <div>
            <Image
            src={logindescription}
            alt="YouTIL Login"
            width={600}
            height={165}
            priority
            />
      </div>
    )
}

export default LoginPageIntro;