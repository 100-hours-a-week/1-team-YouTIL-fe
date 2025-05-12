import Image from "next/image";
import nocommit from "public/nocommit.png"

const NoCommitDescription =() =>{
    return(
        <div>
            <Image
            src={nocommit}
            alt="NoCommit"
            width={270}
            height={150}
            priority
            />
        </div>
    )    
}

export default NoCommitDescription;