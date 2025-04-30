import logindescription from "public/logindescription.png"
import Image from "next/image";
const LoginDescription =() =>{
    return(
        <div>
            <Image
            src={logindescription}
            alt="YouTIL Login"
            width={600}
            height={180}
            priority
            />
      </div>
    )
}

export default LoginDescription;