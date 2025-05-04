import LinkGithubButton from "@/components/commit/linkGithubButton/LinkGithubButton";
import SelectBranchModal from "@/components/commit/selectBranchModal/SelectBranchModal";
import SelectDateCalendar from "@/components/commit/selectDateCalendar/SelectDateCalendar";
import SelectOrganizationModal from "@/components/commit/selectOrganizationModal/SelectOrganizationModal";
import SelectRepositoryModal from "@/components/commit/selectRepositoryModal/SelectRepositoryModal";
import NoCommitDescription from "@/components/description/noCommitDescription/NoCommitDescription";

import './page.scss';

const commit =() =>{
    return(
        <div className="commit-page">
            <SelectDateCalendar/>
            <LinkGithubButton/>
            <NoCommitDescription/>
        </div>
    )
}

export default commit;