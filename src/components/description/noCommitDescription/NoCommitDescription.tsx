import Image from "next/image";
import nocommit from "public/nocommit.png"

const NoCommitDescription =() =>{
    return(
        <div>
            <Image
            src={nocommit}
            alt="NoCommit"
            width={333.6}
            height={175}
            priority
            />
        </div>
    )    
}

export default NoCommitDescription;