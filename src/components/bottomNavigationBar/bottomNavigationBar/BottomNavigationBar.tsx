import GoCommit from "../bottomNavigationBarButton/GoCommit";
import GoCommmuniny from "../bottomNavigationBarButton/GoCommunity";
import GoMainPage from "../bottomNavigationBarButton/GoMainPage";
import GoProfile from "../bottomNavigationBarButton/GoProfile";
import GoRepository from "../bottomNavigationBarButton/GoRepository";

const BottomNavigationBar =() =>{
    return(
        <div>
            <GoCommit/>
            <GoCommmuniny/>
            <GoMainPage/>
            <GoProfile/>
            <GoRepository/>
        </div>
    )
}

export default BottomNavigationBar;