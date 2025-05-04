import Image from "next/image";
import nocommit from "public/nocommit.png"

const NoCommitDescription =() =>{
    return(
        <div>
            <Image
            src={nocommit}
            alt="NoCommit"
            width={300}
            height={165}
            priority
            />
        </div>
    )    
}

export default NoCommitDescription;