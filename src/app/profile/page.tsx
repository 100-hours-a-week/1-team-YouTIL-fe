import UserNickNameDescription from "@/components/profile/userNickNameDescription/UserNickNameDescription";
import UserProfileInfo from "@/components/profile/userProfileInfo/UserProfileInfo";
import UserTILButton from "@/components/profile/userTILButton/UserTILButton";

const profile =() =>{
    return(
        <div>
            <UserNickNameDescription/>
            <UserProfileInfo/>
            <UserTILButton/>
        </div>
    )
}

export default profile;
