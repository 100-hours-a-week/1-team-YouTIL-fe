import LinkGithubButton from "@/components/commit/linkGithubButton/LinkGithubButton";
import SelectDateCalendar from "@/components/commit/selectDateCalendar/SelectDateCalendar";
import NoCommitDescription from "@/components/description/noCommitDescription/NoCommitDescription";
import CommitList from "@/components/commit/commitList/CommitList";

import './page.scss';

const commit =() =>{
    return(
        <div className="commit-page">
            <SelectDateCalendar/>
            <div className="commit-page__space-1"></div>
            <LinkGithubButton/>
            <div className="commit-page__space-1"></div>
            <CommitList/>
        </div>
    )
}

export default commit;